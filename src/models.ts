import { ECardType } from "./constants";

export interface ICompany {
    id: string,
    name: string,
    description: string,
    imageURL: string,   
}

export interface IRedemption {
    id: string;
    notes: string;
    dateRedeemed: string | null | Date; // ISO String
}

export interface IBenefit {
    id: string;
    name: string;
    description: string;
    isRedeemable: boolean; // flag denoting whether the benefit is some generic perk (like free checked bags) or a usable perk (like a free lounge pass)
    numAllowedRedemptions: number | null; // only if isRedeemable is true
    numMonthsAllowedRedemptionsReset: number | null; // only if isRedeemable is true
    noReset: boolean | null; // only defined if isRedeemable is true
    redemptions: IRedemption[];
}

export interface IEarnRate {
    id: string;
    name: string; // stores the earn, i.e. 1.5 points
    description: string; // store how to earn it, i.e. via gas or grocery purchases
}

export interface ISingleGoal {
    goalStartDate: string | null | Date;
    goalEndDate: string | null | Date;
}

export interface IRepeatedGoal {
    goalStartDate: string | null | Date;
    repeatType: string;
    numRepeats: number;
}

export interface IGoal {
    id: string;
    name: string;
    description: string;
    reward: number;
    spendRequired: number;
    goalType: 'SINGLE' | 'REPEATED';
    goalConfig: ISingleGoal | IRepeatedGoal;
}

export interface ICard {
    ynabCardId: string; // this is the primary key we are using as it makes things easier
    id: string; // this will be the unique identifier when the card is closed or product switched and put in the tradeline
    name: string;
    rewardsPointsName?: string; // only if not cashback
    description: string;
    tradeline: ICard[];
    openDate: string | null | Date; // ISO Date
    closeDate?: string | null | Date; // ISO Date, the date that the card was closed or product switched. YNAB handles the closed state, but does not tell us when it was closed so it is up to the user to mark it as such
    creditLimit: number;
    companyId: string;
    cardImageUrl: string;
    benefits: IBenefit[];
    goals: IGoal[];
    annualFee: number;
    cardType: ECardType;
    earnRates: IEarnRate[];
    cycleStartDate: number; // note: start and end are approximations as it is up to each bank to determine cycle lengths. Cycle lengths can be within + or - 30 days
    cycleEndDate: number;
    budgetId: string;
}