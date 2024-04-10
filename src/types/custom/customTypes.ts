/**
 * Guarantee that user is authenticated before accessing protected routes.
 * Also provides a token to add to http requests against the express server to access protected API endpoints
 * @property {number} token JWT Auth token to put in request.Authorization headers concatenated to 'Bearer '
 * @property {string} setToken set returned and decoded string jwt token for authentication of http requests
 * @property {string} loginUserName SELECT username FROM public.um_users
 * @property {string} setLoginUserName setter for a username string
 */
export type AuthInfo = {
  token: string;
  setToken: (token: string) => void;
  loginUserName: string;
  setLoginUserName: (username: string) => void;
};

/**
 * user object containing userId, userName and userEmail extracted from the db.
 * @table public.um_users
 * @property {number} userId SELECT id FROM public.um_users
 * @property {string} userName SELECT username FROM public.um_users
 * @property {string} userEmail SELECT email FROM public.um_users
 */
export type User = {
  userId: number;
  userName: string;
  userEmail: string;
};

/**
 * User Credentials Object used for e.g. Account Creation and INSERT into table public.um_users.
 * @table public.um_users
 * @property {number} username SELECT id FROM public.um_users
 * @property {string} email SELECT username FROM public.um_users
 * @property {string} password SELECT email FROM public.um_users
 */
export type UserCredentials = {
  username: string;
  email: string;
  password: string;
};

/**
 * Username for subsequently querying id from public.um_users and the setting key value pairs to insert into table public.um_user_settings
 * @table public.um_users, public.um_user_settings
 * @property {string} username SELECT id FROM public.um_users WHERE username = 'username'
 * @property {string} settingKey setting_key column of um_user_settings
 * @property {string} settingValue setting_value column of um_user_settings
 */
export type UserSettingObject = {
  username: string;
  settingKey: string;
  settingValue: string;
};

/**
 * id, price and date range for a temporarily discounted food item
 * @table public.food_price_discounts
 * @property {number} id SELECT id FROM public.um_users WHERE username = 'username'
 * @property {number} price setting_key column of um_user_settings
 * @property {Date} startDate setting_value column of um_user_settings
 * @property {Date} endDate setting_value column of um_user_settings
 */
export type FoodItemDiscount = {
  id: number;
  price: number;
  startDate: Date;
  endDate: Date;
};

/**
 * id, price and date range for a temporarily discounted food item
 * @table public.food_price_discounts
 * @property {string} foodItem string of a food item
 * @property {string} brand Brand of the food item
 * @property {string} store Store where the food item is purchased
 * @property {string} mainMacro Main macronutrient of the food item
 * @property {number} kcalAmount Caloric amount of the food item
 * @property {number} weight Weight of the food item
 * @property {number} price Price of the food item
 * @property {Date} lastUpdate Date of the last update for the food item
 */
export type FoodItem = {
  foodItem: string;
  brand: string;
  store: string;
  mainMacro: string;
  kcalAmount: number;
  weight: number;
  price: number;
  lastUpdate: Date;
};

type TwelveCharacterString = `${string & { length: 12 }}`;
/**
 * Complex Type for inserting into 3 tables that have relations to each other.
 * @table public.investment_dividends, public.investment_taxes, public.bridge_investment_dividends
 * @property {TwelveCharacterString} isin International Security Identification Number -> 12 character string beginning with country short
 * @property {number} dividendAmount Amount of dividend received
 * @property {Date} dividendDate Date of dividend payment
 * @property {number} pctOfProfitTaxed Percentage of profit taxed
 * @property {number} profitAmount Total profit amount
 * @property {{ investmentId: number; remainingUnits: number; }} investmentIdsAndRemainingUnits Object containing investment ID and remaining units
 */
export type DividendsRelatedInvestmentsAndTaxes = {
  isin: TwelveCharacterString;
  dividendAmount: number;
  dividendDate: Date;
  pctOfProfitTaxed: number;
  profitAmount: number;
  investmentIdsAndRemainingUnits: {
    investmentId: number;
    remainingUnits: number;
  };
};

/**
 * Bought investments are stored in investments table, if the execution type is sell, tax information is added for investment_taxes table
 * @table public.investments, public.investment_taxes
 * @property {string} executionType string containing the type of execution -> 'buy' or 'sell' *
 * @property {string} description Description of the investment
 * @property {TwelveCharacterString} isin International Security Identification Number -> 12 character string beginning with country short
 * @property {string} investmentType Type of investment
 * @property {string} marketplace Marketplace where the investment was bought from or sold at
 * @property {number} units Number of shares purchased or sold
 * @property {number} pricePerUnit Price per unit of the share
 * @property {number} totalPrice Total price of the investment including fees
 * @property {number} fees Fees paid for the investment execution
 * @property {Date} executionDate Date of the investment transaction execution
 * @property {number | null} profitAmount Amount of profit generated from the investment (nullable for executionType buy)
 * @property {number | null} pctOfProfitTaxed Percentage of profit taxed (nullable for executionType buy)
 */
export type InvestmentAndTaxes = {
  executionType: string;
  description: string;
  isin: TwelveCharacterString;
  investmentType: string;
  marketplace: string;
  units: number;
  pricePerUnit: number;
  totalPrice: number;
  fees: number;
  executionDate: Date;
  profitAmount: number | null;
  pctOfProfitTaxed: number | null;
};

/**
 * Object sent to the server for updating the price and last_update date of a food item entry.
 * @table public.table_food_prices
 * @property {number} price
 * @property {Date} lastUpdate
 */
export type FoodItemUpdateObject = {
  price: number;
  lastUpdate: Date;
};
