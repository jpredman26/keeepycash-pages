export interface MoneyLeak {
  id: number;
  title: string;
  description: string;
  costRange: [number, number];
  whereToLook: string;
  statementExample: string;
  action: string;
}

export const MONEY_LEAKS: MoneyLeak[] = [
  {
    id: 1,
    title: "Forgotten Subscriptions",
    description: "Old subscriptions keep charging long after you stop using them. Apps, software, streaming, and memberships quietly renew every month.",
    costRange: [120, 500],
    whereToLook: "Check the last three months of bank or credit card statements.",
    statementExample: "Netflix, Spotify, Apple.com/bill, Google Play, Adobe, Patreon, software tools.",
    action: "Cancel any subscription you have not used in the last 30 days."
  },
  {
    id: 2,
    title: "Free Trials That Turn Into Paid Plans",
    description: "Many services start as a free trial, then automatically convert to a paid subscription if you forget to cancel. Annual plans are especially painful.",
    costRange: [60, 300],
    whereToLook: "Look for charges that appeared suddenly after a free trial period.",
    statementExample: "Annual subscription charges or first monthly charge from a new service.",
    action: "Set a calendar reminder when starting any free trial."
  },
  {
    id: 3,
    title: "App Subscriptions You Stopped Using",
    description: "Mobile apps often charge weekly or monthly without you noticing. Many people forget about them entirely.",
    costRange: [50, 250],
    whereToLook: "Check your App Store or Google Play subscription list.",
    statementExample: "Apple.com/bill or Google Play recurring payments.",
    action: "Review all app subscriptions and cancel unused ones."
  },
  {
    id: 4,
    title: "Streaming Service Price Creep",
    description: "Streaming services quietly raise prices over time. Many households end up paying for several platforms.",
    costRange: [120, 300],
    whereToLook: "Monthly entertainment subscriptions.",
    statementExample: "Netflix, Disney+, Prime Video, Hulu, etc.",
    action: "Keep one main service and pause the others."
  },
  {
    id: 5,
    title: "Subscription Boxes That Keep Coming",
    description: "Monthly boxes for snacks, beauty products, or hobbies are easy to forget. They keep renewing even when the excitement fades.",
    costRange: [200, 600],
    whereToLook: "Recurring payments from lifestyle brands.",
    statementExample: "Subscription box companies charging monthly.",
    action: "Pause or cancel boxes you no longer look forward to."
  },
  {
    id: 6,
    title: "Food Delivery Markups",
    description: "Delivery apps often increase menu prices and add delivery, service, and small order fees. A $12 meal can easily become $20.",
    costRange: [500, 1500],
    whereToLook: "Evening or weekend card transactions.",
    statementExample: "Uber Eats, Deliveroo, DoorDash, Just Eat.",
    action: "Limit delivery to once per week."
  },
  {
    id: 7,
    title: "Grocery Delivery Premiums",
    description: "Groceries ordered online often cost more than in store. Convenience fees and delivery charges add up.",
    costRange: [200, 600],
    whereToLook: "Online grocery purchases.",
    statementExample: "Supermarket delivery fees.",
    action: "Combine grocery trips and shop in person when possible."
  },
  {
    id: 8,
    title: "Tip Creep",
    description: "Digital payment screens often default to higher tip percentages. People tip more than they planned due to social pressure.",
    costRange: [100, 400],
    whereToLook: "Restaurants, coffee shops, taxis.",
    statementExample: "Final payment higher than the original bill.",
    action: "Choose a consistent tip rule and stick to it."
  },
  {
    id: 9,
    title: "Quick Trip Spending",
    description: "Stopping somewhere for 'just one thing' often turns into multiple small purchases. These trips rarely feel expensive individually.",
    costRange: [300, 800],
    whereToLook: "Frequent small purchases.",
    statementExample: "Convenience stores, petrol stations, small grocery runs.",
    action: "Make a shopping list before leaving the house."
  },
  {
    id: 10,
    title: "Hidden Mandatory Checkout Fees",
    description: "Tickets, travel bookings, and event sites often add extra charges late in checkout. Processing fees, booking fees, service fees.",
    costRange: [50, 300],
    whereToLook: "Event tickets, travel sites, hotel bookings.",
    statementExample: "Higher charge than the advertised price.",
    action: "Compare final checkout price before buying."
  },
  {
    id: 11,
    title: "Internet Modem or Router Rental",
    description: "Many internet providers charge monthly equipment rental fees. Buying your own router is often cheaper.",
    costRange: [60, 180],
    whereToLook: "Internet service provider bills.",
    statementExample: "Equipment rental fee.",
    action: "Check if your provider allows your own router."
  },
  {
    id: 12,
    title: "Promo Pricing That Quietly Ends",
    description: "Internet, phone, and TV providers offer introductory rates. When the promo ends, the bill increases significantly.",
    costRange: [120, 400],
    whereToLook: "Bills that suddenly increased.",
    statementExample: "Higher monthly bill after promotional period.",
    action: "Call your provider and negotiate a new rate."
  },
  {
    id: 13,
    title: "Grocery Waste",
    description: "Many households throw away large amounts of food every month. Unused produce, expired leftovers, forgotten items.",
    costRange: [500, 1000],
    whereToLook: "Food thrown away during weekly kitchen cleanups.",
    statementExample: "Extra grocery spending without meals to show for it.",
    action: "Plan meals before grocery shopping."
  },
  {
    id: 14,
    title: "BNPL Payment Stacking",
    description: "Buy Now Pay Later spreads purchases across future months. Several small payments can stack up quickly.",
    costRange: [200, 800],
    whereToLook: "Short term installment payments.",
    statementExample: "Klarna, Afterpay, Affirm.",
    action: "Avoid new BNPL purchases until current ones are cleared."
  },
  {
    id: 15,
    title: "Missed Refunds and Returns",
    description: "People forget to return items or claim refunds for cancelled services. Retailers rely on this happening.",
    costRange: [50, 300],
    whereToLook: "Old purchases you meant to return.",
    statementExample: "Charges without a matching refund.",
    action: "Review purchases from the last 30 days for return opportunities."
  },
  {
    id: 16,
    title: "Gym Memberships You Rarely Use",
    description: "Many people continue paying for gyms they barely visit. Cancellation processes often discourage quitting.",
    costRange: [300, 700],
    whereToLook: "Monthly direct debits.",
    statementExample: "Gym or fitness club charges.",
    action: "Cancel if you have not gone in the past month."
  },
  {
    id: 17,
    title: "Insurance Renewal Inertia",
    description: "Insurance policies often auto renew at higher prices. Many people forget to shop around.",
    costRange: [100, 400],
    whereToLook: "Annual renewal notices.",
    statementExample: "Insurance provider payments.",
    action: "Compare quotes before the next renewal date."
  }
];
