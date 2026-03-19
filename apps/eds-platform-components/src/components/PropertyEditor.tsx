'use client'

import { TextField, Label } from '@equinor/eds-core-react'
import type { PropertyDefinition } from '@/lib/buttonPropertySchema'
import './property-editor.css'

type PropertyEditorProps = {
  schema: PropertyDefinition[]
  values: Record<string, string | number | boolean | undefined>
  onChange: (propertyId: string, value: string | number | boolean) => void
  category?: string
}

export const PropertyEditor = ({
  schema,
  values,
  onChange,
  category,
}: PropertyEditorProps) => {
  const filteredSchema = category
    ? schema.filter((prop) => prop.category === category)
    : schema

  const renderPropertyControl = (property: PropertyDefinition) => {
    const value = values[property.id]

    switch (property.type) {
      case 'color':
        return (
          <div key={property.id} className="property-control">
            <Label htmlFor={property.id} label={property.label} />
            {property.description && (
              <p className="property-description">{property.description}</p>
            )}
            <div className="color-input-group">
              <input
                type="color"
                id={property.id}
                value={String(value ?? property.defaultValue)}
                onChange={(e) => onChange(property.id, e.target.value)}
                className="property-color-input"
              />
              <TextField
                value={String(value ?? property.defaultValue)}
                onChange={(e) => onChange(property.id, e.target.value)}
                className="property-input property-input--color-text"
                placeholder="#007079"
              />
            </div>
            {property.edsToken && (
              <p className="property-token">{property.edsToken}</p>
            )}
          </div>
        )

      case 'text':
        return (
          <div key={property.id} className="property-control">
            <Label htmlFor={property.id} label={property.label} />
            {property.description && (
              <p className="property-description">{property.description}</p>
            )}
            <TextField
              id={property.id}
              value={String((value as string) ?? property.defaultValue)}
              onChange={(e) => onChange(property.id, e.target.value)}
              className="property-input"
            />
            {property.edsToken && (
              <p className="property-token">{property.edsToken}</p>
            )}
          </div>
        )

      case 'number':
        return (
          <div key={property.id} className="property-control">
            <Label htmlFor={property.id} label={property.label} />
            {property.description && (
              <p className="property-description">{property.description}</p>
            )}
            <div className="number-input-group">
              <TextField
                id={property.id}
                type="number"
                value={(value as number) ?? property.defaultValue}
                onChange={(e) =>
                  onChange(property.id, parseFloat(e.target.value))
                }
                min={property.min}
                max={property.max}
                step={property.step}
                className="property-input property-input--number"
              />
              {property.unit && (
                <span className="property-unit">{property.unit}</span>
              )}
            </div>
            {property.edsToken && (
              <p className="property-token">{property.edsToken}</p>
            )}
          </div>
        )

      case 'select':
        return (
          <div key={property.id} className="property-control">
            <Label htmlFor={property.id} label={property.label} />
            {property.description && (
              <p className="property-description">{property.description}</p>
            )}
            <select
              id={property.id}
              value={String((value as string | number) ?? property.defaultValue)}
              onChange={(e) => onChange(property.id, e.target.value)}
              className="property-select"
            >
              {property.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {property.edsToken && (
              <p className="property-token">{property.edsToken}</p>
            )}
          </div>
        )

      case 'boolean':
        return (
          <div key={property.id} className="property-control">
            <label className="property-checkbox-label">
              <input
                type="checkbox"
                id={property.id}
                checked={Boolean(value ?? property.defaultValue)}
                onChange={(e) => onChange(property.id, e.target.checked)}
                className="property-checkbox"
              />
              <span>{property.label}</span>
            </label>
            {property.description && (
              <p className="property-description">{property.description}</p>
            )}
            {property.edsToken && (
              <p className="property-token">{property.edsToken}</p>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="property-editor">
      {filteredSchema.map(renderPropertyControl)}
    </div>
  )
}
