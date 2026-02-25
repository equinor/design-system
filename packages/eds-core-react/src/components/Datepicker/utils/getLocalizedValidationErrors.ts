import { DateFormatter, DateValue } from '@internationalized/date'

type MessageValue = string | ((args: Record<string, string>) => string)
type LocaleMessages = Record<string, MessageValue>

/**
 * Validation message translations matching @react-stately/datepicker's built-in messages.
 * Sourced from @react-stately/datepicker's intlStrings bundle.
 * Unsupported locales fall back to English.
 */
const allTranslations: Record<string, LocaleMessages> = {
  'en-US': {
    rangeUnderflow: (args) => `Value must be ${args.minValue} or later.`,
    rangeOverflow: (args) => `Value must be ${args.maxValue} or earlier.`,
    unavailableDate: 'Selected date unavailable.',
  },
  'nb-NO': {
    rangeUnderflow: (args) =>
      `Verdien m\u00e5 v\u00e6re ${args.minValue} eller senere.`,
    rangeOverflow: (args) =>
      `Verdien m\u00e5 v\u00e6re ${args.maxValue} eller tidligere.`,
    unavailableDate: 'Valgt dato utilgjengelig.',
  },
  'da-DK': {
    rangeUnderflow: (args) =>
      `V\u00e6rdien skal v\u00e6re ${args.minValue} eller senere.`,
    rangeOverflow: (args) =>
      `V\u00e6rdien skal v\u00e6re ${args.maxValue} eller tidligere.`,
    unavailableDate: 'Den valgte dato er ikke tilg\u00e6ngelig.',
  },
  'sv-SE': {
    rangeUnderflow: (args) =>
      `V\u00e4rdet m\u00e5ste vara ${args.minValue} eller senare.`,
    rangeOverflow: (args) =>
      `V\u00e4rdet m\u00e5ste vara ${args.maxValue} eller tidigare.`,
    unavailableDate: 'Valt datum \u00e4r inte tillg\u00e4ngligt.',
  },
  'de-DE': {
    rangeUnderflow: (args) =>
      `Der Wert muss ${args.minValue} oder sp\u00e4ter sein.`,
    rangeOverflow: (args) =>
      `Der Wert muss ${args.maxValue} oder fr\u00fcher sein.`,
    unavailableDate: 'Das ausgew\u00e4hlte Datum ist nicht verf\u00fcgbar.',
  },
  'fr-FR': {
    rangeUnderflow: (args) =>
      `La valeur doit \u00eatre ${args.minValue} ou ult\u00e9rieure.`,
    rangeOverflow: (args) =>
      `La valeur doit \u00eatre ${args.maxValue} ou ant\u00e9rieure.`,
    unavailableDate: 'Date s\u00e9lectionn\u00e9e non disponible.',
  },
  'es-ES': {
    rangeUnderflow: (args) => `El valor debe ser ${args.minValue} o posterior.`,
    rangeOverflow: (args) => `El valor debe ser ${args.maxValue} o anterior.`,
    unavailableDate: 'Fecha seleccionada no disponible.',
  },
  'pt-BR': {
    rangeUnderflow: (args) => `O valor deve ser ${args.minValue} ou posterior.`,
    rangeOverflow: (args) => `O valor deve ser ${args.maxValue} ou anterior.`,
    unavailableDate: 'Data selecionada indispon\u00edvel.',
  },
  'pt-PT': {
    rangeUnderflow: (args) =>
      `O valor tem de ser ${args.minValue} ou posterior.`,
    rangeOverflow: (args) => `O valor tem de ser ${args.maxValue} ou anterior.`,
    unavailableDate: 'Data selecionada indispon\u00edvel.',
  },
  'pl-PL': {
    rangeUnderflow: (args) =>
      `Warto\u015b\u0107 musi wynosi\u0107 ${args.minValue} lub p\u00f3\u017aniej.`,
    rangeOverflow: (args) =>
      `Warto\u015b\u0107 musi wynosi\u0107 ${args.maxValue} lub wcze\u015bniej.`,
    unavailableDate: 'Wybrana data jest niedost\u0119pna.',
  },
  'nl-NL': {
    rangeUnderflow: (args) => `Waarde moet ${args.minValue} of later zijn.`,
    rangeOverflow: (args) => `Waarde moet ${args.maxValue} of eerder zijn.`,
    unavailableDate: 'Geselecteerde datum niet beschikbaar.',
  },
  'it-IT': {
    rangeUnderflow: (args) =>
      `Il valore deve essere ${args.minValue} o successivo.`,
    rangeOverflow: (args) =>
      `Il valore deve essere ${args.maxValue} o precedente.`,
    unavailableDate: 'Data selezionata non disponibile.',
  },
  'ja-JP': {
    rangeUnderflow: (args) =>
      `\u5024\u306f${args.minValue}\u4ee5\u964d\u3067\u3042\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002`,
    rangeOverflow: (args) =>
      `\u5024\u306f${args.maxValue}\u4ee5\u524d\u3067\u3042\u308b\u5fc5\u8981\u304c\u3042\u308a\u307e\u3059\u3002`,
    unavailableDate:
      '\u9078\u629e\u3057\u305f\u65e5\u4ed8\u306f\u5229\u7528\u3067\u304d\u307e\u305b\u3093\u3002',
  },
  'ko-KR': {
    rangeUnderflow: (args) =>
      `\uac12\uc740 ${args.minValue} \uc774\ud6c4\uc5ec\uc57c \ud569\ub2c8\ub2e4.`,
    rangeOverflow: (args) =>
      `\uac12\uc740 ${args.maxValue} \uc774\uc804\uc774\uc5b4\uc57c \ud569\ub2c8\ub2e4.`,
    unavailableDate:
      '\uc120\ud0dd\ud55c \ub0a0\uc9dc\ub97c \uc0ac\uc6a9\ud560 \uc218 \uc5c6\uc2b5\ub2c8\ub2e4.',
  },
  'zh-CN': {
    rangeUnderflow: (args) =>
      `\u503c\u5fc5\u987b\u4e3a ${args.minValue} \u6216\u66f4\u665a\u3002`,
    rangeOverflow: (args) =>
      `\u503c\u5fc5\u987b\u4e3a ${args.maxValue} \u6216\u66f4\u65e9\u3002`,
    unavailableDate: '\u6240\u9009\u65e5\u671f\u4e0d\u53ef\u7528\u3002',
  },
  'zh-TW': {
    rangeUnderflow: (args) =>
      `\u503c\u5fc5\u9808\u70ba ${args.minValue} \u6216\u66f4\u665a\u3002`,
    rangeOverflow: (args) =>
      `\u503c\u5fc5\u9808\u70ba ${args.maxValue} \u6216\u66f4\u65e9\u3002`,
    unavailableDate: '\u6240\u9078\u65e5\u671f\u4e0d\u53ef\u7528\u3002',
  },
  'ru-RU': {
    rangeUnderflow: (args) =>
      `\u0417\u043d\u0430\u0447\u0435\u043d\u0438\u0435 \u0434\u043e\u043b\u0436\u043d\u043e \u0431\u044b\u0442\u044c ${args.minValue} \u0438\u043b\u0438 \u043f\u043e\u0437\u0436\u0435.`,
    rangeOverflow: (args) =>
      `\u0417\u043d\u0430\u0447\u0435\u043d\u0438\u0435 \u0434\u043e\u043b\u0436\u043d\u043e \u0431\u044b\u0442\u044c ${args.maxValue} \u0438\u043b\u0438 \u0440\u0430\u043d\u044c\u0448\u0435.`,
    unavailableDate:
      '\u0412\u044b\u0431\u0440\u0430\u043d\u043d\u0430\u044f \u0434\u0430\u0442\u0430 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430.',
  },
  'uk-UA': {
    rangeUnderflow: (args) =>
      `\u0417\u043d\u0430\u0447\u0435\u043d\u043d\u044f \u043c\u0430\u0454 \u0431\u0443\u0442\u0438 ${args.minValue} \u0430\u0431\u043e \u043f\u0456\u0437\u043d\u0456\u0448\u0435.`,
    rangeOverflow: (args) =>
      `\u0417\u043d\u0430\u0447\u0435\u043d\u043d\u044f \u043c\u0430\u0454 \u0431\u0443\u0442\u0438 ${args.maxValue} \u0430\u0431\u043e \u0440\u0430\u043d\u0456\u0448\u0435.`,
    unavailableDate:
      '\u0412\u0438\u0431\u0440\u0430\u043d\u0430 \u0434\u0430\u0442\u0430 \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430.',
  },
  'ar-AE': {
    rangeUnderflow: (args) =>
      `\u064a\u062c\u0628 \u0623\u0646 \u062a\u0643\u0648\u0646 \u0627\u0644\u0642\u064a\u0645\u0629 ${args.minValue} \u0623\u0648 \u0623\u062d\u062f\u062b.`,
    rangeOverflow: (args) =>
      `\u064a\u062c\u0628 \u0623\u0646 \u062a\u0643\u0648\u0646 \u0627\u0644\u0642\u064a\u0645\u0629 ${args.maxValue} \u0623\u0648 \u0623\u0642\u062f\u0645.`,
    unavailableDate:
      '\u0627\u0644\u062a\u0627\u0631\u064a\u062e \u0627\u0644\u0645\u062d\u062f\u062f \u063a\u064a\u0631 \u0645\u062a\u0627\u062d.',
  },
  'fi-FI': {
    rangeUnderflow: (args) =>
      `Arvon on oltava ${args.minValue} tai my\u00f6hempi.`,
    rangeOverflow: (args) => `Arvon on oltava ${args.maxValue} tai aikaisempi.`,
    unavailableDate:
      'Valittu p\u00e4iv\u00e4m\u00e4\u00e4r\u00e4 ei ole k\u00e4ytett\u00e4viss\u00e4.',
  },
}

const englishFallback = allTranslations['en-US']

/**
 * Find the best matching locale from available translations.
 * Tries exact match first (e.g. "nb-NO"), then language prefix match (e.g. "nb" → "nb-NO").
 */
function findLocaleMessages(locale: string): LocaleMessages {
  if (allTranslations[locale]) return allTranslations[locale]

  const language = Intl.Locale
    ? new Intl.Locale(locale).language
    : locale.split('-')[0]

  // First match wins: e.g. "pt" → "pt-BR", "zh" → "zh-CN"
  for (const key of Object.keys(allTranslations)) {
    const keyLang = key.split('-')[0]
    if (keyLang === language) return allTranslations[key]
  }

  return englishFallback
}

function formatMessage(
  msg: MessageValue,
  args: Record<string, string>,
): string {
  return typeof msg === 'function' ? msg(args) : msg
}

/**
 * Generates validation error messages using the provided locale instead of
 * navigator.language (which is what react-stately uses internally).
 *
 * This fixes the issue where validation messages appear in the browser's
 * language rather than the locale configured via I18nProvider.
 */
export function getLocalizedValidationErrors(
  validationDetails: ValidityState,
  locale: string,
  minValue?: DateValue | null,
  maxValue?: DateValue | null,
  timezone?: string,
): string[] {
  const msgs = findLocaleMessages(locale)
  const dateFormatter = new DateFormatter(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })
  const timeZone = timezone ?? dateFormatter.resolvedOptions().timeZone

  const errors: string[] = []

  if (validationDetails.rangeUnderflow && minValue && msgs.rangeUnderflow) {
    errors.push(
      formatMessage(msgs.rangeUnderflow, {
        minValue: dateFormatter.format(minValue.toDate(timeZone)),
      }),
    )
  }
  if (validationDetails.rangeOverflow && maxValue && msgs.rangeOverflow) {
    errors.push(
      formatMessage(msgs.rangeOverflow, {
        maxValue: dateFormatter.format(maxValue.toDate(timeZone)),
      }),
    )
  }
  // react-stately maps isDateUnavailable to badInput (not customError)
  if (validationDetails.badInput && msgs.unavailableDate) {
    errors.push(formatMessage(msgs.unavailableDate, {}))
  }

  return errors
}
