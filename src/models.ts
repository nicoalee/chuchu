export interface ICompany {
    id: string,
    name: string,
    description: string,
    imageURL: string,   
}

export interface IBenefit {
    id: string;
    name: string;
    description: string;
    isRedeemed: boolean;
}

export interface IGoal {
    id: string;
    name: string;
    description: string;
    isCompleted: boolean;
    reward: number;
    rewardName: string;
    spendRequired: number;
    goalMode: 'SINGLE' | 'REPEATED';
    goalConfig: {
        goalStartDate: string; // ISO String;
        goalEndDate?: string; // ISO String, for single goals only
        numMonthlyOccurrences?: number; // for repeated goals only
    }
}

export interface ICard {
    ynabCardId: string; // this is the primary key we are using as it makes things easier
    id: string; // this will be the unique identifier when the card is closed or product switched and put in the tradeline
    name: string;
    description: string;
    tradeline: ICard[];
    summary: string;
    openDate: string; // ISO Date
    closeDate?: string; // ISO Date
    creditLimit: number;
    companyId: string;
    benefits: IBenefit[];
    goals: IGoal[];
}