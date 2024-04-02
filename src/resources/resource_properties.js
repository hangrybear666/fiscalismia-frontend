export const resourceProperties = {
  APP_NAME: "Fiscalismia",
  APP_URL: 'http://localhost:5173/',
  OVERVIEW: 'Übersicht',
  HOME: 'Home',
  DEALS: 'Angebote',
  DATE: 'Datum',
  ALL: 'Alle',
  GRAMS: 'g',
  ALL: 'Alle',
  NO_IMG: 'no-img',
  SYMBOL_PERCENT: '%',
  PIECES_SHORT: 'pcs',
  UPLOAD_IMG: 'Bild hochladen',
  KCAL: 'kcal',
  SIGN_IN: 'Einloggen',
  CREATE_ACCOUNT: 'Account anlegen',
  USERNAME: 'Nutzername',
  PASSWORD: 'Passwort',
  SAVE: 'Speichern',
  ADMIN_PANEL: 'Adminbereich',
  UPLOAD_AREA: 'DB Upload',
  FOOD_PRICES: 'Lebensmittelpreise',
  GROCERY_DEALS: 'Supermarkt Angebote',
  PLACEHOLDER: 'Platzhalter',
  LOGGED_IN_AS:'Nutzername:',
  SELECTED_MODE:'Farbmodus:',
  SELECTED_PALETTE:'Farbpalette:',
  GROCERIES: 'Lebensmittel',
  OVER_TOTAL_PERIOD: 'Im gesamten Zeitraum',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  RESET: 'Reset',
  MONTHLY_BUDGET:'Monatliches Budget',
  BUDGET: 'Budget',
  INVESTMENTS: 'Investments',
  PORTFOLIO: 'Portfolio',
  SALES: 'Verkäufe',
  SORT_BY: 'Sortieren nach',
  LIVING_ESSENTIALS:'Wohnen & Essentielles',
  RECREATION_RELAXATION:'Freizeit & Erholung',
  STORES: 'Verkaufsplattformen',
  INDULGENCES:'Genussmittel',
  COPYRIGHT: 'Copyright ©',
  VARIABLE_EXPENSES: 'Variable Ausgaben',
  EMAIL: 'Email Adresse',
  INCOME: 'Einkommen',
  FIXED_COSTS: 'Fixkosten',
  SETTINGS: 'Einstellungen',
  GITHUB_REPO:'Github Repository',
  GITHUB_REPOS:'Github Repositories',
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  CURRENCY_EURO: '\u20AC',
  GITHUB_FRONTEND_URL: 'https://github.com/hangrybear666/fiscalismia-frontend',
  GITHUB_BACKEND_URL: 'https://github.com/hangrybear666/fiscalismia-backend',
  INTERVAL_MONTHLY: 'monatlich',
  INTERVAL_QUARTERLY: 'quartalsweise',
  INTERVAL_HALFYEARLY: 'halbjährlich',
  INTERVAL_YEARLY: 'jährlich',
  FALLBACK_DATE: '2024-01-01',
  ERROR_MSG_INCOME_DATA_REQUIRED: 'Fixed Income data required to extract effective_dates',

  BAD_REQUEST: 'Bad Request',
  ERROR_FALLBACK_MESSAGE: 'Error has not been handled explicitly. Implementation should catch this properly.',
  STATUS: 'Status',
  STATUSTEXT: 'StatusText',
  DATA: 'Data',
  STATUS_NOT_DEFINED: 'Status Not defined',
  STATUSTEXT_NOT_DEFINED: 'StatusText Not defined',
  GENERIC_ERROR_MESSAGE: 'Sorry, an unexpected error has occurred.',
  NOT_DEFINED: 'Not defined',
  // Functions with placeholder vars
  USER_ALREADY_LOGGED_IN : (pos1) => (`User ${pos1} is already logged in.`),
  PATH_DOES_NOT_EXIST : (pos1) => (`Sorry, the requested path ${pos1} does not exist.`),

  INCOME_MONTHLY_NET_INCOME: 'Monatlicher Gesamtlohn [Netto]',
  INCOME_FIXED_COST_CARD_HEADER: 'Fixkosten Gesamt',
  INCOME_MONTHLY_BUDGET_CHART_HEADER: 'Monatliches Budget',
  INCOME_YEARLY_GROSS_INCOME: 'Jahreslohn [Brutto]',
  INCOME_MONTHLY_FIXED_COSTS: 'Monatliche Fixkosten',
  INCOME_NET_INCOME: 'Lohn [Netto]',
  INCOME_GROSS_INCOME: 'Lohn [Brutto]',
  INCOME_ONE_TIME_BONUS: 'Einmaliger Bonus [Netto]',
  INCOME_NET_SALARY_KEY: 'net salary',
  INCOME_GROSS_SALARY_KEY: 'gross salary',

  INCOME_SALES_THEADER_DESCRIPTION: 'Artikel',
  INCOME_SALES_THEADER_COST: 'Verkaufspreis',
  INCOME_SALES_THEADER_STORE: 'Verkaufsplattform',
  INCOME_SALES_THEADER_DATE: 'Verkaufsdatum',
  INCOME_SALES_CARD_TOTAL_SALES_HEADER: 'Verkäufe Gesamt',
  INCOME_SALES_CARD_TOTAL_SALES_SUBTITLE: 'Im Jahr',
  INCOME_SALES_CARD_DISTINCT_STORE_SALES_DETAILS_HEADER: 'Verkäufe über 100\u20AC',

  INCOME_INVESTMENTS_COL_HEADER_ISIN: 'ISIN',
  INCOME_INVESTMENTS_COL_HEADER_AGGREGATE: 'Aggregate',
  INCOME_INVESTMENTS_COL_HEADER_TYPE: 'Type',
  INCOME_INVESTMENTS_COL_HEADER_DIVIDEND: 'Dividend',
  INCOME_INVESTMENTS_COL_HEADER_PCT_OF_TOTAL: 'Pct of Total',
  INCOME_INVESTMENTS_COL_HEADER_AVG_PRICE: 'Average Price',
  INCOME_INVESTMENTS_COL_HEADER_UNIT_PRICE: 'Unit Price',
  INCOME_INVESTMENTS_COL_HEADER_TOTAL: 'Total',
  INCOME_INVESTMENTS_COL_HEADER_DATE: 'Date',
  INCOME_INVESTMENTS_TOOLTIP_PROFIT_AMT_GROSS: 'Gewinn (Brutto): ',
  INCOME_INVESTMENTS_TOOLTIP_TAXED_AMT: 'Steuerabzug: ',
  INCOME_INVESTMENTS_TOOLTIP_PROFIT_AMT_NET: 'Gewinn (Netto): ',
  INCOME_INVESTMENTS_EXECUTION_TYPE_SELL_KEY: 'sell',
  INCOME_INVESTMENTS_EXECUTION_TYPE_BUY_KEY: 'buy',

  FIXED_COSTS_MONHTLY_COST: 'Gesamtkosten',
  FIXED_COSTS_RENT_UTILITIES: 'Miete & Nebenkosten',
  FIXED_COSTS_DSL_PHONE: 'DSL & Mobilfunk',
  FIXED_COSTS_SPORTS_HEALTH: 'Sport & Gesundheit',
  FIXED_COSTS_SPORTS_HEALTH_CATEGORY1: 'Studiomitgliedschaften',
  FIXED_COSTS_SPORTS_HEALTH_CATEGORY2: 'Supplemente: Gesundheit',
  FIXED_COSTS_SPORTS_HEALTH_CATEGORY3: 'Supplemente: Leistung',
  FIXED_COSTS_SPORTS_HEALTH_CATEGORY4: 'Physio & Gesundheitskurse',
  FIXED_COSTS_MEDIA_ENTERTAINMENT: 'Medien & Unterhaltung',
  FIXED_COSTS_MEDIA_ENTERTAINMENT_CATEGORY1: 'Gaming',
  FIXED_COSTS_MEDIA_ENTERTAINMENT_CATEGORY2: 'Filme & Serien',
  FIXED_COSTS_MEDIA_ENTERTAINMENT_CATEGORY3: 'Musik & Podcasts',
  FIXED_COSTS_INSURANCE: 'Versicherungen',
  FIXED_COSTS_STUDENT_LOANS: 'Studienkredite',

  DEALS_OVERVIEW_THEADER_FOODITEM: 'Artikel',
  DEALS_OVERVIEW_THEADER_BRAND: 'Marke',
  DEALS_OVERVIEW_THEADER_STORE: 'Supermarkt',
  DEALS_OVERVIEW_THEADER_MAIN_MACRO: 'Hauptmakro',
  DEALS_OVERVIEW_THEADER_KCAL_AMT_TOP: 'Kalorien',
  DEALS_OVERVIEW_THEADER_WEIGHT_TOP: 'Gewicht',
  DEALS_OVERVIEW_THEADER_PRICE_TOP: 'Preis',
  DEALS_OVERVIEW_THEADER_LAST_UPDATE_TOP: 'zuletzt geprüft',
  DEALS_OVERVIEW_THEADER_NORMALIZED_PRICE_TOP: 'Gesamtverbrauch Hochrechnung',

  DEALS_FOOD_PRICES_SELECTITEMS_MACRO_LABEL: 'Auswahl Makronährstoff',
  DEALS_FOOD_PRICES_SELECTITEMS_DELETE_SELECTION: 'Auswahl löschen',

  DEALS_GROCERY_DEALS_THEADER_FOODITEM: 'Artikel',
  DEALS_GROCERY_DEALS_THEADER_BRAND: 'Marke',
  DEALS_GROCERY_DEALS_THEADER_STORE: 'Supermarkt',
  DEALS_GROCERY_DEALS_THEADER_ORIGINAL_PRICE: 'Originalpreis',
  DEALS_GROCERY_DEALS_THEADER_DISCOUNT_AMOUNT: 'Preisreduktion',
  DEALS_GROCERY_DEALS_THEADER_DISCOUNT_PRICE: 'Angebotspreis',
  DEALS_GROCERY_DEALS_THEADER_DISCOUNT_PCT: 'Ersparnis',
  DEALS_GROCERY_DEALS_THEADER_DISCOUNT_START_DATE: 'gültig von',
  DEALS_GROCERY_DEALS_THEADER_DISCOUNT_END_DATE: 'gültig bis',

  MINOR_INPUT_FOOD_DISCOUNT_MODAL_OPEN: 'Angebot hinzufügen',
  MINOR_INPUT_FOOD_DISCOUNT_MODAL_DISCOUNT_AMOUNT: 'Angebotspreis',
  MINOR_INPUT_FOOD_DISCOUNT_MODAL_START_DATE: 'gültig von',
  MINOR_INPUT_FOOD_DISCOUNT_MODAL_END_DATE: 'gültig bis',
  MINOR_INPUT_FOOD_DISCOUNT_MODAL_SELECTDROPDOWN_LABEL: 'Artikel auswählen',
  MINOR_INPUT_FOOD_DISCOUNT_MODAL_FOOD_ITEM_SELECTION_ERROR_MSG: 'Kein Artikel ausgewählt.',
  MINOR_INPUT_FOOD_DISCOUNT_MODAL_PRICE_VALIDATION_ERROR_MSG: 'Preis im folgenden Format erwartet: 12.05',
  MINOR_INPUT_FOOD_DISCOUNT_MODAL_GENERIC_DATE_VALIDATION_ERROR_MSG: 'Datum im folgenden Format erwartet: DD.MM.YYYY',
  MINOR_INPUT_FOOD_DISCOUNT_MODAL_END_DATE_BEFORE_START_DATE_VALIDATION_ERROR_MSG: 'Das Startdatum muss vor dem Enddatum liegen.',

  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_OPEN: 'Variable Ausgabe hinzufügen',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_INPUT_INDULGENCE: 'Unverträglichkeiten',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_INPUT_DATE_OF_PURCHASE: 'Datum',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_INPUT_PRICE:  'Preis in €',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_DESCRIPTION:  'Ausgaben(-liste)',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_STORE: 'Laden',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_CATEGORY: 'Art der Ausgabe',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_IS_PLANNED_LABEL: 'War die Ausgabe geplant?',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_CONTAINS_INDULGENCE_LABEL: 'Enthält die Ausgabe Unverträglichkeiten?',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_INDULGENCE_VALIDATION_ERROR_MSG: 'Todo unvertr.',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_PRICE_VALIDATION_ERROR_MSG: 'Todo preis',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_DESCRIPTION_VALIDATION_ERROR_MSG: 'Todo beschreibung',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_STORE_AUTOCOMPLETE_VALIDATION_ERROR_MSG: 'Todo store',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_CATEGORY_AUTOCOMPLETE_VALIDATION_ERROR_MSG: 'Todo category',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_GENERIC_DATE_VALIDATION_ERROR_MSG: 'Datum im folgenden Format erwartet: DD.MM.YYYY',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_PRESET_ID_TODAY: 'date_today',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_PRESET_TOOLTIP_TODAY: 'Heutiges Datum',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_PRESET_ID_COFFEE: 'coffee_in_shop',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_PRESET_TOOLTIP_COFFEE: 'Drink im Café',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_PRESET_ID_COLA: 'cola_in_kiosk',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_PRESET_TOOLTIP_COLA: 'Cola Zero im Kiosk',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_PRESET_ID_SCHOKOBROETCHEN: 'schokobrot_for_ana',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_PRESET_TOOLTIP_SCHOKOBROETCHEN: 'Schokobrötchen für Ana',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_PRESET_ID_BREAKFAST: 'eggs_and_shrimp',
  MINOR_INPUT_VARIABLE_EXPENSE_MODAL_PRESET_TOOLTIP_BREAKFAST: 'Bio Eier und TK Shrimps',

  MINOR_INPUT_FOOD_ITEM_MODAL_OPEN: 'Artikel hinzufügen',
  MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_FOOD_ITEM: 'Artikel',
  MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_PRICE: 'Preis in €',
  MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_WEIGHT: 'Gewicht in Gramm',
  MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_KCAL_AMOUNT: 'kcal/100g',
  MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_LAST_UPDATE: 'Datum des letzten Preischecks',
  MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_MAIN_MACRO: 'Hauptmakro',
  MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_STORE: 'Laden',
  MINOR_INPUT_FOOD_ITEM_MODAL_INPUT_BRAND: 'Marke',
  MINOR_INPUT_FOOD_ITEM_MODAL_PRICE_VALIDATION_ERROR_MSG: 'Preis im folgenden Format erwartet: 12.05',
  MINOR_INPUT_FOOD_ITEM_MODAL_KCAL_AMOUNT_VALIDATION_ERROR_MSG: 'Kalorien als Zahl erwartet, zB.: 350',
  MINOR_INPUT_FOOD_ITEM_MODAL_FOOD_ITEM_VALIDATION_ERROR_MSG: 'Artikel muss mindestens 5 Zeichen enthalten.',
  MINOR_INPUT_FOOD_ITEM_MODAL_BRAND_VALIDATION_ERROR_MSG: 'Marke muss mindestens 4 Zeichen enthalten.',
  MINOR_INPUT_FOOD_ITEM_MODAL_WEIGHT_VALIDATION_ERROR_MSG: 'Gewicht als Zahl in Gramm erwartet, zB.: 500',
  MINOR_INPUT_FOOD_ITEM_MODAL_GENERIC_DATE_VALIDATION_ERROR_MSG: 'Datum im folgenden Format erwartet: DD.MM.YYYY',

  MINOR_INPUT_ALL_FOOD_ITEMS_MODAL_OPEN: 'TSV Import Supermarktartikel',
  MINOR_INPUT_ALL_FOOD_ITEMS_MODAL_INPUT_TEXT_AREA_DESCRIPTION: 'TSV Input/Output',
  MINOR_INPUT_ALL_FOOD_ITEMS_MODAL_INPUT_TEXT_AREA_HELPER: 'MANDATORY HEADERS: food_item, brand, store,  main_macro, kcal_amount, weight, price, last_update',

  MINOR_INPUT_FIXED_COSTS_MODAL_OPEN: 'TSV Import Fixkosten',
  MINOR_INPUT_FIXED_COSTS_MODAL_INPUT_TEXT_AREA_DESCRIPTION: 'TSV Input/Output',
  MINOR_INPUT_FIXED_COSTS_MODAL_INPUT_TEXT_AREA_HELPER: 'MANDATORY HEADERS: category, description,  monthly_interval,  billed_cost, monthly_cost,  effective_date,  expiration_date',

  MINOR_INPUT_VARIABLE_EXPENSES_MODAL_OPEN: 'TSV Import Variable Ausgaben',
  MINOR_INPUT_VARIABLE_EXPENSES_MODAL_INPUT_TEXT_AREA_DESCRIPTION: 'TSV Input/Output',
  MINOR_INPUT_VARIABLE_EXPENSES_MODAL_INPUT_TEXT_AREA_HELPER: 'MANDATORY HEADERS: description,  category,  store cost,  date,  is_planned,  contains_indulgence, sensitivities',

  MINOR_INPUT_FIXED_INCOME_MODAL_OPEN: 'TSV Import Monatslohn',
  MINOR_INPUT_FIXED_INCOME_MODAL_INPUT_TEXT_AREA_DESCRIPTION: 'TSV Input/Output',
  MINOR_INPUT_FIXED_INCOME_MODAL_INPUT_TEXT_AREA_HELPER: 'MANDATORY HEADERS: description,	type,	monthly_interval,	value,	effective_date,	expiration_date',

  MINOR_INPUT_INVESTMENTS_MODAL_OPEN: 'TSV Import Investments',
  MINOR_INPUT_INVESTMENTS_MODAL_INPUT_TEXT_AREA_DESCRIPTION: 'TSV Input/Output',
  MINOR_INPUT_INVESTMENTS_MODAL_INPUT_TEXT_AREA_HELPER: 'MANDATORY HEADERS: execution_type,	description,	isin,	investment_type,	marketplace,	units,	price_per_unit,	total_price,	fees,	execution_date',

  MINOR_FILTER_FOOD_PRICES_NAME_HEADER: 'Suche',
  MINOR_FILTER_FOOD_PRICES_FOOD_ITEM_INPUT_LABEL: 'Artikel',
  MINOR_FILTER_FOOD_PRICES_MACRO_HEADER: 'Auswahl Makronährstoff',
  MINOR_FILTER_FOOD_PRICES_STORE_HEADER: 'Auswahl Supermarkt',
  MINOR_FILTER_FOOD_PRICES_CLEAR_FILTER: 'Auswahl löschen',
  MINOR_FILTER_FOOD_PRICES_RENDER_IMAGES_SWITCH_LABEL: 'Bilder anzeigen',
  MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_PRICE_PER_KG_ASC: 'Nach €/kg aufsteigend.',
  MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_BTN_VALUE_PRICE_PER_KG: 'Kilopreis',
  MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_PRICE_PER_KG_DESC: 'Nach €/kg absteigend.',
  MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_PRICE_ASC: 'Nach € aufsteigend.',
  MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_BTN_VALUE_PRICE: 'Preis',
  MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_PRICE_DESC: 'Nach € absteigend.',
  MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_NORMALIZED_PRICE_ASC: 'Nach € aufsteigend.',
  MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_BTN_VALUE_NORMALIZED_PRICE: 'Preis für Tag',
  MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_BTN_VALUE_TOOLTIP_NORMALIZED_PRICE: 'Wenn nur dieses Nahrungsmittel 3500kcal abdecken müsste, was wäre der Preis?',
  MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_NORMALIZED_PRICE_DESC: 'Nach € absteigend.',
  MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_KCAL_AMOUNT_KG_ASC: 'Nach kcal/100g aufsteigend.',
  MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_BTN_VALUE_KCAL_AMOUNT: 'KCAL',
  MINOR_FILTER_FOOD_PRICES_SORT_CRITERIA_TOOLTIP_KCAL_AMOUNT_DESC: 'Nach kcal/100g absteigend.',

  MINOR_INPUT_CREATE_ACCOUNT_MODAL_USERNAME_VALIDATION_ERROR_MSG_1: 'Kein Nutzername angegeben.',
  MINOR_INPUT_CREATE_ACCOUNT_MODAL_USERNAME_VALIDATION_ERROR_MSG_2: 'Nutzername muss mindestens 3 Zeichen enthalten.',

  MINOR_INPUT_CREATE_ACCOUNT_MODAL_PASSWORD_VALIDATION_ERROR_MSG_1: 'Kein Passwort angegeben.',
  MINOR_INPUT_CREATE_ACCOUNT_MODAL_PASSWORD_VALIDATION_ERROR_MSG_2: 'Passwort muss mindestens 8 Zeichen enthalten.',

  MINOR_INPUT_CREATE_ACCOUNT_MODAL_EMAIL_VALIDATION_ERROR_MSG_1: 'Email ist keine valide Adresse',
};

export const localStorageKeys = {
  token: 'jwt-token',
  loginUserName: 'loginUserName',
  authenticated: 'userAuthenticated',
  selectedMode: 'selected_mode',
  selectedPalette: 'selected_palette',
}

export const fixedCostCategories = {
  LIVING_ESSENTIALS_KEY: 'LIVING_ESSENTIALS',
  LIVING_ESSENTIALS_VALUE: 'Miete & Nebenkosten',
  INTERNET_AND_PHONE_KEY: 'INTERNET_AND_PHONE',
  INTERNET_AND_PHONE_VALUE: 'Internet & Mobilfunk',
  INSURANCE_KEY: 'INSURANCE',
  INSURANCE_VALUE: 'Versicherungen',
  STUDENT_LOANS_KEY: 'STUDENT_LOANS',
  STUDENT_LOANS_VALUE: 'Studienkredite',
  LEISURE_MUSIC_PODCASTS_KEY: 'LEISURE_MUSIC_PODCASTS',
  LEISURE_MUSIC_PODCASTS_VALUE: 'Musik & Podcasts',
  LEISURE_TV_CINEMA_KEY: 'LEISURE_TV_CINEMA',
  LEISURE_TV_CINEMA_VALUE: 'Filme & Serien',
  LEISURE_GAMING_KEY: 'LEISURE_GAMING',
  LEISURE_GAMING_VALUE: 'Gaming',
  SPORTS_FACILITIES_KEY: 'SPORTS_FACILITIES',
  SPORTS_FACILITIES_VALUE: 'Studiomitgliedschaften',
  SUPPLEMENTS_HEALTH_KEY: 'SUPPLEMENTS_HEALTH',
  SUPPLEMENTS_HEALTH_VALUE: 'Supplemente: Gesundheit',
  SUPPLEMENTS_PERFORMANCE_KEY: 'SUPPLEMENTS_PERFORMANCE',
  SUPPLEMENTS_PERFORMANCE_VALUE: 'Supplemente: Leistung',
  PHYSIO_AND_HEALTH_COURSES_KEY: 'PHYSIO_AND_HEALTH_COURSES',
  PHYSIO_AND_HEALTH_COURSES_VALUE: 'Physio & Gesundheitskurse',
}

export const foodItemInputCategories = {
  ARRAY_STORES: [
    'Aldi Süd',
    'Lidl',
    'Kaufland',
    'Rewe',
    'Metro',
    'Amazon',
    'Netto',
    'Edeka',
    'Metzger',
    'Online',
    'Alle',
  ],
  JSON_STORES: {
    aldi: 'Aldi Süd',
    lidl: 'Lidl',
    kaufland: 'Kaufland',
    rewe: 'Rewe',
    metro: 'Metro',
    amazon: 'Amazon',
    netto: 'Netto',
    edeka: 'Edeka',
    butcher: 'Metzger',
    online: 'Online',
    all: 'Alle',
  },
  ARRAY_MACROS: [
    'Protein',
    'Fat',
    'Carbs',
    'Fiber'
  ],
  JSON_MACROS: {
    protein: 'Protein',
    fat: 'Fat',
    carbs: 'Carbs',
    fiber: 'Fiber'
  }
}

export const serverConfig = {
  NODE_ROOT_URL: 'http://localhost:3002/',
  API_BASE_URL: 'http://localhost:3002/api/fiscalismia',
  // API_BASE_URL: `http://172.19.64.1:3002/api/fiscalismia`, // WSL for Jenkins
  // API_BASE_URL: `http://192.168.178.37:3002/api/fiscalismia`,
}