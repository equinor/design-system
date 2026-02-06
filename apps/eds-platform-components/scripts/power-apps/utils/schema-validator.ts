/**
 * Power Apps YAML Schema Validator
 * Validates generated YAML against Power Apps official schema
 * Schema: https://raw.githubusercontent.com/microsoft/PowerApps-Tooling/refs/heads/master/schemas/pa-yaml/v3.0/pa.schema.yaml
 */

import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'yaml'
import Ajv, { ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export type ValidationResult = {
  isValid: boolean
  errors: string[]
  warnings: string[]
}

const POWERAPPS_SCHEMA_URL =
  'https://raw.githubusercontent.com/microsoft/PowerApps-Tooling/refs/heads/master/schemas/pa-yaml/v3.0/pa.schema.yaml'

let cachedSchema: object | null = null
let cachedValidator: ValidateFunction | null = null

/**
 * Fetches Power Apps schema from URL or local cache
 */
export const fetchPowerAppsSchema = async (): Promise<object | null> => {
  if (cachedSchema) {
    return cachedSchema
  }

  const schemaPath = path.join(__dirname, '../schemas/pa.schema.yaml')

  // Try to load from local cache first
  if (fs.existsSync(schemaPath)) {
    try {
      const content = fs.readFileSync(schemaPath, 'utf-8')
      cachedSchema = yaml.parse(content)
      return cachedSchema
    } catch {
      console.warn('Failed to load local schema cache, fetching from URL...')
    }
  }

  // Fetch from URL
  try {
    const response = await fetch(POWERAPPS_SCHEMA_URL)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    const content = await response.text()
    cachedSchema = yaml.parse(content)

    // Cache for future use
    try {
      const schemasDir = path.dirname(schemaPath)
      if (!fs.existsSync(schemasDir)) {
        fs.mkdirSync(schemasDir, { recursive: true })
      }
      fs.writeFileSync(schemaPath, content, 'utf-8')
    } catch {
      // Silently ignore cache errors
    }

    return cachedSchema
  } catch {
    // Silently handle fetch errors and use basic validation
    return null
  }
}

/**
 * Initializes Ajv validator with Power Apps schema
 */
const getValidator = async (): Promise<ValidateFunction | null> => {
  if (cachedValidator) {
    return cachedValidator
  }

  const schema = await fetchPowerAppsSchema()
  if (!schema) {
    return null
  }

  try {
    const ajv = new Ajv({
      strict: false,
      allErrors: true,
      validateFormats: true,
    })
    addFormats(ajv)

    cachedValidator = ajv.compile(schema)
    return cachedValidator
  } catch {
    // Silently handle schema compilation errors (e.g., invalid regex patterns in schema)
    // The Power Apps schema contains some regex patterns that are not compatible with JavaScript
    // We'll fall back to basic validation in this case
    return null
  }
}

/**
 * Performs basic YAML validation without schema
 */
const basicValidation = (yamlContent: string): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
  }

  try {
    const parsed = yaml.parse(yamlContent)

    if (!parsed) {
      result.isValid = false
      result.errors.push('YAML content is empty or invalid')
      return result
    }

    // Power Apps YAML is typically an array of components
    if (!Array.isArray(parsed) && typeof parsed !== 'object') {
      result.warnings.push(
        'Expected YAML root to be an array or object for Power Apps components',
      )
    }

    // Check for PowerFX syntax in property values
    const checkPowerFX = (obj: unknown): void => {
      if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'string') {
            // Check for RGBA format
            if (
              value.includes('RGBA(') &&
              !value.match(/RGBA\(\d+,\s*\d+,\s*\d+,\s*[\d.]+\)/)
            ) {
              result.warnings.push(
                `Potential PowerFX syntax issue in ${key}: ${value}`,
              )
            }
            // Check for formula syntax (starts with =)
            if (value.startsWith('=') && value.length < 2) {
              result.warnings.push(`Empty formula in ${key}`)
            }
          } else if (typeof value === 'object') {
            checkPowerFX(value)
          }
        }
      }
    }

    checkPowerFX(parsed)
  } catch (error) {
    result.isValid = false
    result.errors.push(
      `YAML parsing error: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  return result
}

/**
 * Validates YAML content against Power Apps schema
 */
export const validatePowerAppsYAML = async (
  yamlContent: string,
): Promise<ValidationResult> => {
  // First, perform basic validation
  const basicResult = basicValidation(yamlContent)
  if (!basicResult.isValid) {
    return basicResult
  }

  // Try to validate against schema
  const validator = await getValidator()

  if (!validator) {
    // If schema is not available, return basic validation with warning
    basicResult.warnings.push(
      'Power Apps schema not available - only basic validation performed',
    )
    return basicResult
  }

  try {
    const parsed = yaml.parse(yamlContent)
    const isValid = validator(parsed)

    const result: ValidationResult = {
      isValid: isValid === true,
      errors: [...basicResult.errors],
      warnings: [...basicResult.warnings],
    }

    if (!isValid && validator.errors) {
      for (const error of validator.errors) {
        const errorPath = error.instancePath || 'root'
        const errorMsg = error.message || 'Unknown error'
        result.errors.push(`${errorPath}: ${errorMsg}`)
      }
    }

    return result
  } catch (error) {
    return {
      isValid: false,
      errors: [
        `Schema validation error: ${error instanceof Error ? error.message : String(error)}`,
      ],
      warnings: basicResult.warnings,
    }
  }
}

/**
 * Validates YAML file against Power Apps schema
 */
export const validateYAMLFile = async (
  filePath: string,
): Promise<ValidationResult> => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    return await validatePowerAppsYAML(content)
  } catch (error) {
    return {
      isValid: false,
      errors: [
        `File reading error: ${error instanceof Error ? error.message : String(error)}`,
      ],
      warnings: [],
    }
  }
}

/**
 * Saves YAML content to file
 */
export const saveYAML = (
  content: string,
  outputPath: string,
): { success: boolean; error?: string } => {
  try {
    const dir = path.dirname(outputPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(outputPath, content, 'utf-8')
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    }
  }
}

/**
 * Loads YAML schema from URL or file
 */
export const loadSchema = async (
  schemaPath: string,
): Promise<object | null> => {
  try {
    if (schemaPath.startsWith('http')) {
      // Fetch from URL
      const response = await fetch(schemaPath)
      return await response.json()
    } else {
      // Load from file
      const content = fs.readFileSync(schemaPath, 'utf-8')
      return yaml.parse(content)
    }
  } catch (error) {
    console.error('Schema loading error:', error)
    return null
  }
}
