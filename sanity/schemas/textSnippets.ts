import { Flags } from '../src/lib/datasetHelpers'

export const groups = {
  newsroom: { title: 'Newsroom', hidden: !Flags.HAS_NEWSROOM },
  magazine: { title: 'Magazine', hidden: !Flags.HAS_MAGAZINE },
  search: { title: 'Search', hidden: !Flags.HAS_SEARCH },
  eventPromotion: { title: 'Event', hidden: !Flags.HAS_EVENT },
  subscribeForm: { title: 'Subscribe form', hidden: !Flags.HAS_FORMS },
  careerFairForm: { title: 'Career fair form', hidden: !Flags.HAS_FORMS },
  contactForm: { title: 'Contact form', hidden: !Flags.HAS_FORMS },
  careerContactForm: { title: 'Careers Contact Form', hidden: !Flags.HAS_FORMS },
  orderAnnualReportsForm: { title: 'Order annual reports form', hidden: !Flags.HAS_FORMS },
  form: { title: 'Form', hidden: !Flags.HAS_FORMS },
  cookie: { title: 'Cookie' },
  others: { title: 'Others' },
}
const snippets: textSnippet = {
  loading: {
    title: 'Loading',
    defaultValue: 'Loading...',
    group: groups.others,
  },
  menu: {
    title: 'Menu',
    defaultValue: 'Menu',
    group: groups.others,
  },
  all_sites: {
    title: 'All sites',
    defaultValue: 'All sites',
    group: groups.others,
  },
  latest_news: {
    title: 'Latest News',
    defaultValue: 'Latest News',
    hidden: !Flags.HAS_NEWS,
    group: groups.others,
  },
  breadcrumbs_home: {
    title: 'Breadcrumbs : Home',
    defaultValue: 'Home',
    group: groups.others,
  },
  tba: {
    title: 'To be announced',
    defaultValue: 'To be announced',
    group: groups.eventPromotion,
  },
  add_to_calendar_event: {
    title: 'Add to Calendar',
    defaultValue: 'Add to Calendar',
    group: groups.eventPromotion,
  },
  details: {
    title: 'Details',
    defaultValue: 'Details',
    group: groups.eventPromotion,
  },
  add_to_calendar_aria_label: {
    title: 'Add event to calendar',
    defaultValue: `Add {eventTitle} to calendar`,
    group: groups.eventPromotion,
  },
  search: {
    title: 'Search',
    defaultValue: 'Search',
    group: groups.search,
  },
  search_news_tab: {
    title: 'News tab name',
    defaultValue: 'News',
    group: groups.search,
  },
  search_magazine_tab: {
    title: 'Magazine tab name',
    defaultValue: 'Magazine',
    group: groups.magazine,
  },
  search_events_tab: {
    title: 'Events tab name',
    defaultValue: 'Events',
    group: groups.search,
  },
  search_topics_tab: {
    title: 'Topics tab name',
    defaultValue: 'Topics',
    group: groups.search,
  },
  search_no_results_heading: {
    title: 'No results title',
    defaultValue: 'NOTHING FOUND',
    group: groups.search,
  },
  search_showing_results_number: {
    title: 'Showing X of Y results',
    defaultValue: '{currentlyShowing} of {nbHits} results',
    group: groups.search,
  },
  search_no_results_generic: {
    title: 'No search results, generic',
    defaultValue: 'Sorry, no results were found. Please try again with some different keywords.',
    group: groups.search,
  },
  copyright: {
    title: 'Copyright',
    defaultValue: 'Copyright 2022 Equinor ASA',
    group: groups.others,
  },
  subscribe_form_choose: {
    title: 'Choose validation',
    defaultValue: 'Please choose one or more of the following',
    group: groups.subscribeForm,
  },
  subscribe_form_first_name: {
    title: 'First name',
    defaultValue: 'First name',
    group: groups.subscribeForm,
  },
  subscribe_form_name_validation: {
    title: 'Name validation',
    defaultValue: 'Please fill out your name',
    group: groups.subscribeForm,
  },
  subscribe_form_email: {
    title: 'Email',
    defaultValue: 'Email',
    group: groups.subscribeForm,
  },
  subscribe_form_email_validation: {
    title: 'Email validation',
    defaultValue: 'Please fill out a valid email address',
    group: groups.subscribeForm,
  },
  subscribe_form_general_news: {
    title: 'General News',
    defaultValue: 'General News',
    group: groups.subscribeForm,
  },
  subscribe_form_magazine_stories: {
    title: 'Magazine stories',
    defaultValue: 'Magazine stories',
    group: groups.subscribeForm,
  },
  subscribe_form_stock_market: {
    title: 'Stock market announcements',
    defaultValue: 'Stock market announcements',
    group: groups.subscribeForm,
  },
  subscribe_form_cruide_oil: {
    title: 'Crude oil assays',
    defaultValue: 'Crude oil assays',
    group: groups.subscribeForm,
  },
  subscribe_form_cta: {
    title: 'CTA',
    defaultValue: 'Subscribe',
    group: groups.subscribeForm,
  },
  subscribe_form_all: {
    title: 'All',
    defaultValue: 'All',
    group: groups.subscribeForm,
  },
  cookie_settings: {
    title: 'Cookie settings link text',
    defaultValue: 'Cookie settings',
    group: groups.cookie,
  },
  cookie_type_marketing: {
    title: 'Type marketing',
    defaultValue: 'marketing',
    group: groups.cookie,
  },
  cookie_type_statistics: {
    title: 'Type statistics',
    defaultValue: 'statistics',
    group: groups.cookie,
  },
  cookie_consent_header: {
    title: 'Consent header',
    defaultValue: 'Accept Cookies',
    group: groups.cookie,
  },
  cookie_consent: {
    title: 'Information text',
    defaultValue:
      'Want the full picture? We’d love to share this content with you, but first you must accept {typeOfCookie} cookies by enabling them in our cookie settings.',
    group: groups.cookie,
  },
  contact_form_name: {
    title: 'Name',
    defaultValue: 'Name',
    group: groups.contactForm,
  },
  contact_form_name_placeholder: {
    title: 'Name Placeholder',
    defaultValue: 'Jane Doe',
    group: groups.contactForm,
  },
  contact_form_email: {
    title: 'Email',
    defaultValue: 'Email',
    group: groups.contactForm,
  },
  contact_form_name_validation: {
    title: 'Name validation',
    defaultValue: 'Please fill out your name',
    group: groups.contactForm,
  },
  contact_form_email_validation: {
    title: 'Email validation',
    defaultValue: 'Please fill out a valid email address',
    group: groups.contactForm,
  },
  contact_form_category: {
    title: 'Category',
    defaultValue: 'Category',
    group: groups.contactForm,
  },
  contact_form_how_to_help: {
    title: 'How can we help you?',
    defaultValue: 'How can we help you?',
    group: groups.contactForm,
  },
  contact_form_how_to_help_placeholder: {
    title: `Please don't enter any personal information`,
    defaultValue: `Please don't enter any personal information`,
    group: groups.contactForm,
  },
  contact_form_how_to_help_validation: {
    title: 'Please let us know how we may help you',
    defaultValue: 'Please let us know how we may help you',
    group: groups.contactForm,
  },
  contact_form_ask_us: {
    title: 'Ask us a question',
    defaultValue: 'Ask us a question',
    group: groups.contactForm,
  },
  contact_form_report_error: {
    title: 'Report an error',
    defaultValue: 'Report an error',
    group: groups.contactForm,
  },
  contact_form_contact_department: {
    title: 'Contact a department or member of staff',
    defaultValue: 'Contact a department or member of staff',
    group: groups.contactForm,
  },
  contact_form_investor_relations: {
    title: 'Investor relations',
    defaultValue: 'Investor relations',
    group: groups.contactForm,
  },
  contact_form_human_rights_information_request: {
    title: 'Human Rights Information Request',
    defaultValue: 'Human Rights Information Request',
    group: groups.contactForm,
  },
  contact_form_login_issues: {
    title: 'Login Issues',
    defaultValue: 'Login Issues',
    group: groups.contactForm,
  },
  contact_form_other: {
    title: 'Other',
    defaultValue: 'Other',
    group: groups.contactForm,
  },
  contact_form_cta: {
    title: 'CTA',
    defaultValue: 'Submit form',
    group: groups.contactForm,
  },
  career_fair_form_organisation: {
    title: 'Organisation',
    defaultValue: 'School / Organisation',
    group: groups.careerFairForm,
  },

  career_fair_form_organisation_validation: {
    title: 'Organisation validation',
    defaultValue: 'Please enter your school or organisation',
    group: groups.careerFairForm,
  },
  career_fair_form_contact_person: {
    title: 'Contact Person',
    defaultValue: 'Contact Person',
    group: groups.careerFairForm,
  },
  career_fair_form_contact_person_validation: {
    title: 'Contact Person validation',
    defaultValue: 'Please enter a contact person',
    group: groups.careerFairForm,
  },
  career_fair_form_name_placeholder: {
    title: 'Name Placeholder',
    defaultValue: 'Jane Doe',
    group: groups.careerFairForm,
  },
  career_fair_form_phone: {
    title: 'Phone number',
    defaultValue: 'Phone number',
    group: groups.careerFairForm,
  },
  career_fair_form_phone_validation: {
    title: 'Phone Number validation',
    defaultValue: 'Please enter your phone number',
    group: groups.careerFairForm,
  },
  career_fair_form_email: {
    title: 'Email',
    defaultValue: 'Email',
    group: groups.careerFairForm,
  },
  career_fair_form_email_validation: {
    title: 'Email validation',
    defaultValue: 'Please fill out a valid email address',
    group: groups.careerFairForm,
  },
  career_fair_form_event: {
    title: 'Event',
    defaultValue: 'Event',
    group: groups.careerFairForm,
  },
  career_fair_form_event_description: {
    title: 'Event Description',
    defaultValue: 'Event Description (max 3400 characters)',
    group: groups.careerFairForm,
  },
  career_fair_form_event_description_validation: {
    title: 'Event Description validation',
    defaultValue: 'Please enter a description for the event',
    group: groups.careerFairForm,
  },
  career_fair_form_website: {
    title: 'Link to website',
    defaultValue: 'Link to website',
    group: groups.careerFairForm,
  },
  career_fair_form_supporting_documents: {
    title: 'Supporting Documents checkbox',
    defaultValue: 'Tick the box if you would like to send supporting documents, and we will get in touch with you',
    group: groups.careerFairForm,
  },
  career_fair_form_invite_career_fair: {
    title: 'Invite to career fair/ student event',
    defaultValue: 'Invite Equinor to a career fair or student event',
    group: groups.careerFairForm,
  },
  career_fair_form_invite_company_presentation: {
    title: 'Invite to hold company presentation',
    defaultValue: 'Invite Equinor to hold a company presentation',
    group: groups.careerFairForm,
  },
  career_fair_form_visit_equinor: {
    title: 'Visit Equinor office',
    defaultValue: 'Would like to visit Equinor office or facility',
    group: groups.careerFairForm,
  },
  career_fair_form_visit_equinor_helper_text: {
    title: 'We offer visits to a few locations',
    defaultValue:
      'Please be aware that we only offer visits to a few selected locations. Please specify your preferred location and we will revert to you as soon as we can.',
    group: groups.careerFairForm,
  },
  career_fair_form_cta: {
    title: 'CTA',
    defaultValue: 'Submit form',
    group: groups.careerFairForm,
  },

  order_reports_form_name: {
    title: 'Name',
    defaultValue: 'Name',
    group: groups.orderAnnualReportsForm,
  },

  order_reports_form_name_validation: {
    title: 'Enter name',
    defaultValue: 'Please enter your name',
    group: groups.orderAnnualReportsForm,
  },
  order_reports_form_name_placeholder: {
    title: 'Name placeholder',
    defaultValue: 'Jane Doe',
    group: groups.orderAnnualReportsForm,
  },

  order_reports_form_email: {
    title: 'Email',
    defaultValue: 'Email',
    group: groups.orderAnnualReportsForm,
  },
  order_reports_form_email_validation: {
    title: 'Email validation',
    defaultValue: 'Please fill out a valid email address',
    group: groups.orderAnnualReportsForm,
  },
  order_reports_form_company: {
    title: 'Company',
    defaultValue: 'Company',
    group: groups.orderAnnualReportsForm,
  },
  order_reports_form_company_validation: {
    title: 'Company Validation',
    defaultValue: 'Please enter your company',
    group: groups.orderAnnualReportsForm,
  },
  order_reports_form_address: {
    title: 'Address',
    defaultValue: 'Address',
    group: groups.orderAnnualReportsForm,
  },
  order_reports_form_address_validation: {
    title: 'Address Validation',
    defaultValue: 'Please enter your address',
    group: groups.orderAnnualReportsForm,
  },
  order_reports_form_zipcode: {
    title: 'Address',
    defaultValue: 'Post number/Zip code',
    group: groups.orderAnnualReportsForm,
  },
  order_reports_form_zipcode_validation: {
    title: 'zipcode Validation',
    defaultValue: 'Please enter your post number/Zip code',
    group: groups.orderAnnualReportsForm,
  },
  order_reports_form_city: {
    title: 'City',
    defaultValue: 'City',
    group: groups.orderAnnualReportsForm,
  },
  order_reports_form_city_validation: {
    title: 'City Validation',
    defaultValue: 'Please enter your city',
    group: groups.orderAnnualReportsForm,
  },
  order_reports_form_country: {
    title: 'Country',
    defaultValue: 'Country',
    group: groups.orderAnnualReportsForm,
  },
  order_reports_form_country_validation: {
    title: 'Country Validation',
    defaultValue: 'Please enter your country',
    group: groups.orderAnnualReportsForm,
  },

  order_reports_form_cta: {
    title: 'CTA',
    defaultValue: 'Order printed copies',
    group: groups.orderAnnualReportsForm,
  },

  order_reports_form_choose: {
    title: 'Choose validation',
    defaultValue: 'Please select atleast one of the reports',
    group: groups.orderAnnualReportsForm,
  },
  careers_contact_form_name: {
    title: 'Name',
    defaultValue: 'Your Name',
    group: groups.careerContactForm,
  },

  careers_contact_form_name_placeholder: {
    title: 'Name Placeholder',
    defaultValue: 'Jane Doe',
    group: groups.careerContactForm,
  },
  careers_contact_form_email: {
    title: 'Email',
    defaultValue: 'Email',
    group: groups.careerContactForm,
  },
  careers_contact_form_name_validation: {
    title: 'Name validation',
    defaultValue: 'Please fill out your name',
    group: groups.careerContactForm,
  },
  careers_contact_form_email_validation: {
    title: 'Email validation',
    defaultValue: 'Please fill out a valid email address',
    group: groups.careerContactForm,
  },
  careers_contact_form_category: {
    title: 'Category',
    defaultValue: 'Category',
    group: groups.careerContactForm,
  },
  careers_contact_form_questions: {
    title: 'Type your questions',
    defaultValue: 'Type your questions',
    group: groups.careerContactForm,
  },
  careers_contact_form_location: {
    title: 'Location',
    defaultValue: 'Location',
    group: groups.careerContactForm,
  },
  careers_contact_form_thesis_writing: {
    title: 'Thesis writing',
    defaultValue: 'Thesis writing',
    group: groups.careerContactForm,
  },
  careers_contact_form_questions_related_to_position: {
    title: 'Questions related to a specific position',
    defaultValue: 'Questions related to a specific position',
    group: groups.careerContactForm,
  },
  careers_contact_form_technical_issues: {
    title: 'Technical issue when applying for a specific position',
    defaultValue: 'Technical issue when applying for a specific position',
    group: groups.careerContactForm,
  },
  careers_contact_form_phone: {
    title: 'Phone number',
    defaultValue: 'Phone number',
    group: groups.careerContactForm,
  },
  careers_contact_form_phone_validation: {
    title: 'Phone Number validation',
    defaultValue: 'Please enter your phone number',
    group: groups.careerContactForm,
  },
  careers_contact_form_phone_placeholder: {
    title: 'Phone Number placeholder',
    defaultValue: 'Country code and phone number',
    group: groups.careerContactForm,
  },
  careers_contact_form_position: {
    title: 'Position Id/ Name',
    defaultValue: 'Position ID/name',
    group: groups.careerContactForm,
  },
  careers_contact_form_cta: {
    title: 'CTA',
    defaultValue: 'Submit form',
    group: groups.careerContactForm,
  },
  careers_contact_form_location_validation: {
    title: 'Location validation',
    defaultValue: 'Enter a location',
    group: groups.careerContactForm,
  },
  careers_contact_form_location_placeholder: {
    title: 'Country/city',
    defaultValue: 'Country/city',
    group: groups.careerContactForm,
  },
  careers_contact_form_questions_validation: {
    title: 'Questions validation',
    defaultValue: 'Please enter a question',
    group: groups.careerContactForm,
  },
  form_sending: {
    title: 'Sending...',
    defaultValue: 'Sending...',
    group: groups.form,
  },
  form_failure_title: {
    title: 'Failure title',
    defaultValue: 'Sorry, something went wrong!',
    group: groups.form,
  },
  form_failure_line1: {
    title: 'Failure line1',
    defaultValue: 'The form was not submitted.',
    group: groups.form,
  },
  form_failure_line2: {
    title: 'Failure line2',
    defaultValue: 'Please try again',
    group: groups.form,
  },
  form_failure_cta: {
    title: 'Failure CTA',
    defaultValue: 'Try again',
    group: groups.form,
  },
  form_success_title: {
    title: 'Success title',
    defaultValue: 'Thank you!',
    group: groups.form,
  },
  form_success_line1: {
    title: 'Success line1',
    defaultValue: 'Your form was successfully submitted.',
    group: groups.form,
  },
  form_success_line2: {
    title: 'Success line2',
    defaultValue: 'You will hear from us shortly.',
    group: groups.form,
  },
  form_success_cta: {
    title: 'Success CTA',
    defaultValue: 'Reopen the form',
    group: groups.form,
  },
  newsroom_topic_filter: {
    title: 'Topic filter heading',
    defaultValue: 'Topic',
    group: groups.newsroom,
  },
  newsroom_country_filter: {
    title: 'Country filter heading',
    defaultValue: 'Country',
    group: groups.newsroom,
  },
  newsroom_local_market_filter: {
    title: 'Local market filter heading',
    defaultValue: 'Local market',
    group: groups.newsroom,
    hidden: !Flags.IS_DEV,
  },
  newsroom_year_filter: {
    title: 'Year filter heading',
    defaultValue: 'Year',
    group: groups.newsroom,
  },
  newsroom_newslist_header: {
    title: 'News list heading',
    defaultValue: 'News',
    group: groups.newsroom,
  },
  newsroom_no_relevant_filters: {
    title: 'No options for a filter',
    defaultValue: 'No relevant content for this filter',
    group: groups.newsroom,
  },
  newsroom_no_hits: {
    title: 'No hits',
    defaultValue: 'Your search returned no results',
    group: groups.newsroom,
  },
  magazineindex_list_header: {
    title: 'Magazine index: Stories list heading',
    defaultValue: 'Stories',
    group: groups.magazine,
  },
  magazine_tag_filter: {
    title: 'Magazine filter heading',
    defaultValue: 'Magazine Tag',
    group: groups.magazine,
  },
  magazine_tag_filter_all: {
    title: 'All',
    defaultValue: 'ALL',
    group: groups.magazine,
  },
  stock_nyse_time_delay_message: {
    title: 'Stock API: NYSE time delay message',
    defaultValue: 'at least 20 minutes delayed',
    group: groups.others,
    hidden: Flags.IS_SATELLITE,
  },
}

type textSnippetGroup = { title: string; hidden?: boolean }
type textSnippet = Record<
  string,
  {
    title: string
    defaultValue: string
    hidden?: boolean
    group: textSnippetGroup
  }
>

const sortedTextSnippets = Object.keys(snippets)
  .filter((key) => !snippets[key].hidden)
  .sort()
  .reduce((obj: textSnippet, key) => {
    obj[key] = snippets[key]
    return obj
  }, {})

export default sortedTextSnippets
