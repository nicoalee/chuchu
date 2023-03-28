import { create, StateCreator, StoreMutatorIdentifier } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export enum ECompany {
    TD = 'TD',
    CIBC = 'CIBC',
    SCOTIABANK = 'SCOTIABANK',
    RBC = 'RBC',
    AMEX = 'AMERICANEXPRESS',
    CHASE = 'CHASE'
}

export interface ICategory {
    id: string;
    name: string;
    rewardRatio: number;
}

export interface ISingleGoalConfig {
    goalStartDate?: string;
    goalEndDate?: string;
}

export interface IRepeatedGoalConfig {
    goalStartDate?: string;
    repeatType?: 'monthly';
    numOccurrences?: number;
}

export interface IGoal {
    id: string;
    name: string;
    description: string;
    reward: number;
    altReward: string;
    spendRequired: number;
    metadata: {
        goalMode: 'single-goal' | 'repeated-goal',
        configs?: ISingleGoalConfig | IRepeatedGoalConfig
    };
}

export interface ITransaction {
    id: string;
    date: string;
    amount: number;
    payee: string;
    note: string;
    category: ICategory
    hardCodedReward?: number // for reconciliation
}

export interface ICard {
    id: string;
    name: string;
    description: string;
    company: ECompany;
    openDate: string;
    closeDate: string;
    cycleStartDay: number;
    cycleEndDay: number;
    type: 'CASHBACK' | 'POINTS';
    categories: ICategory[];
    goals: IGoal[];
    transactions: ITransaction[];
}

export interface ICardStoreActions {
    initStore: () => void;
    createCard: (card: Partial<ICard>) => void;
    deleteCard: (cardId: string) => void;
    updateCard: (
        cardUpdate: Partial<ICard>
    ) => void;
    addOrUpdateGoal: (cardId: string, goal: IGoal) => void;
    deleteGoal: (cardId: string, goalId: string) => void;
    addCategory: (cardId: string, category: ICategory) => void;
    deleteCategory: (cardId: string, categoryId: string) => void;
    addOrUpdateTransaction: (cardId: string, transaction: ITransaction) => void;
    deleteTransaction: (cardId: string, transactionId: string) => void;
}

const generateID = () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

type APIDebouncedUpdater = <
    T extends unknown,
    Mps extends [StoreMutatorIdentifier, unknown][] = [],
    Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
    f: StateCreator<T, Mps, Mcs>,
    name?: string
) => StateCreator<T, Mps, Mcs>;

type APIDebouncedUpdaterImpl = <T extends unknown>(
    f: StateCreator<T, [], []>,
    name?: string
) => StateCreator<T, [], []>;

const apiDebouncedUpdaterImpl: APIDebouncedUpdaterImpl = (f, name) => (set, get, store) => {
    let timeout: number | NodeJS.Timeout | undefined = undefined;

    const debouncedAPIUpdaterSet: typeof set = (...a) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            const storeData = get() as unknown as { cards: ICard[]} & ICardStoreActions;

            if (!storeData.cards) return;

            localStorage.setItem(`updateCurationIsLoading`, 'true');
            window.dispatchEvent(new Event('storage'));
            axios.put('http://localhost:3080/cards', {
                cards: storeData.cards
            })
        }, 1000);

        set(...a);
    };
    // replace all state updater functions with our custom implementation
    store.setState = debouncedAPIUpdaterSet;
    return f(debouncedAPIUpdaterSet, get, store);
};

export const apiDebouncedUpdaterImplMiddleware = apiDebouncedUpdaterImpl as unknown as APIDebouncedUpdater;

const useCardStore = create<{ cards: ICard[] } & ICardStoreActions>()(
    apiDebouncedUpdaterImplMiddleware(
        persist(
            (set) => ({
                cards: [] as ICard[],
                initStore: async () => {
                    const res = await axios.get('http://localhost:3080/cards');

                    set((state) => ({
                        ...state,
                        cards: res.data.cards || []
                    }))
                },
                deleteCard: (cardId: string) => {
                    set((state) => {
                        const update = [...state.cards];
                        const foundCardIndex = update.findIndex(x => x.id === cardId);
                        if (foundCardIndex < 0) return state;

                        update.splice(foundCardIndex, 1);
                        return {
                            ...state,
                            cards: update
                        }
                    })
                },
                createCard: (card: Partial<ICard>) => {
                    const newCard: ICard = {
                        id: generateID(),
                        name: '',
                        description: '',
                        company: ECompany.TD,
                        openDate: '',
                        closeDate: '',
                        cycleStartDay: 0,
                        cycleEndDay: 0,
                        type: 'POINTS',
                        categories: [],
                        goals: [],
                        transactions: [],
                        ...card
                    };

                    set((state) => ({
                        ...state,
                        cards: [
                            newCard,
                            ...state.cards,
                        ]
                    }))
                },
                updateCard: (card) => {
                    set((state) => {
                        const update = [...state.cards];
                        const foundCartIndex = state.cards.findIndex(x => x.id === card.id);
                        if (foundCartIndex < 0) return state;

                        update[foundCartIndex] = {
                            ...update[foundCartIndex],
                            ...card,
                        }

                        return {
                            ...state,
                            cards: update
                        }
                    })
                },
                addOrUpdateGoal: (cardId: string, goal: IGoal) => {
                    set((state) => {
                        const update = [...state.cards];
                        const foundCardIndex = update.findIndex(x => x.id === cardId);
                        if (foundCardIndex < 0) return state;

                        const foundGoalIndex = update[foundCardIndex].goals.findIndex(x => x.id === goal.id);
                        if (foundGoalIndex < 0) {
                            // no goal found, add new one
                            update[foundCardIndex] = {
                                ...update[foundCardIndex],
                                goals: [
                                    { ...goal, id: generateID() },
                                    ...update[foundCardIndex].goals
                                ]
                            };
                        } else {
                            const updatedGoals = [...update[foundCardIndex].goals];
                            updatedGoals[foundGoalIndex] = {
                                ...updatedGoals[foundGoalIndex],
                                ...goal
                            }

                            update[foundCardIndex] = {
                                ...update[foundCardIndex],
                                goals: updatedGoals
                            }
                        }

                        return {
                            ...state,
                            cards: update
                        }
                    })
                },
                addCategory: (cardId: string, category: ICategory) => {
                    set((state) => {
                        const update = [...state.cards];
                        const foundCardIndex = update.findIndex(x => x.id === cardId);
                        if (foundCardIndex < 0) return state;

                        const updatedCategories = [
                            { ...category, id: generateID() },
                            ...update[foundCardIndex].categories
                        ];

                        update[foundCardIndex] = {
                            ...update[foundCardIndex],
                            categories: updatedCategories
                        }

                        return {
                            ...state,
                            cards: update
                        }
                    })
                },
                deleteCategory: (cardId, categoryId) => {
                    set((state) => {
                        const update = [...state.cards];
                        const foundCardIndex = update.findIndex(x => x.id === cardId);
                        if (foundCardIndex < 0) return state;

                        const updatedCategories = [...update[foundCardIndex].categories];
                        const foundCategoryIndex = updatedCategories.findIndex(x => x.id === categoryId);
                        if (foundCategoryIndex < 0) return state;

                        updatedCategories.splice(foundCategoryIndex, 1);
                        update[foundCardIndex] = {
                            ...update[foundCardIndex],
                            categories: updatedCategories
                        }

                        return {
                            ...state,
                            cards: update
                        }
                    })
                },
                deleteGoal: (cardId, goalId) => {
                    set((state) => {
                        const update = [...state.cards];
                        const foundCardIndex = update.findIndex(x => x.id === cardId);
                        if (foundCardIndex < 0) return state;

                        const updatedGoals = [...update[foundCardIndex].goals];
                        const foundGoalIndex = updatedGoals.findIndex(x => x.id === goalId);
                        if (foundGoalIndex < 0) return state;

                        updatedGoals.splice(foundGoalIndex, 1);
                        update[foundCardIndex] = {
                            ...update[foundCardIndex],
                            goals: updatedGoals
                        }

                        return {
                            ...state,
                            cards: update
                        }
                    })
                },
                addOrUpdateTransaction: (cardId, transaction) => {
                    set((state) => {
                        const update = [...state.cards];
                        const foundCardIndex = update.findIndex(x => x.id === cardId);
                        if (foundCardIndex < 0) return state;

                        const updatedTransactions = [...update[foundCardIndex].transactions];
                        const foundTransactionIndex = updatedTransactions.findIndex(x => x.id === transaction.id);
                        if (foundTransactionIndex < 0) {
                            updatedTransactions.push({
                                ...transaction,
                                id: generateID(),
                            })
                        } else {
                            updatedTransactions[foundTransactionIndex] = {
                                ...updatedTransactions[foundTransactionIndex],
                                ...transaction
                            }
                        }
                        update[foundCardIndex] = {
                            ...update[foundCardIndex],
                            transactions: updatedTransactions
                        }

                        return {
                            ...state,
                            cards: update
                        }
                    })
                },
                deleteTransaction: (cardId, transactionId) => {
                    set((state) => {
                        const update = [...state.cards];
                        const foundCardIndex = update.findIndex(x => x.id === cardId);
                        if (foundCardIndex < 0) return state;

                        const updatedTransactions = [...update[foundCardIndex].transactions];
                        const foundTransactionIndex = updatedTransactions.findIndex(x => x.id === transactionId);
                        if (foundTransactionIndex < 0) return state;
                        updatedTransactions.splice(foundTransactionIndex, 1)

                        update[foundCardIndex] = {
                            ...update[foundCardIndex],
                            transactions: updatedTransactions
                        };

                        return {
                            ...state,
                            cards: update
                        }
                    })
                }
            }),
            {
                name: 'chuchu-cards'
            }
        ),
        'chuchu-store'
    )
)

export default useCardStore

export const useGetCard = (cardId: string) => {
    return useCardStore((state) => {
        const foundCard = state.cards.find(x => x.id === cardId);
        if (foundCard) return foundCard;
        return null
    })
}

export const useGetGoals = (cardId: string) => {
    const foundCard = useGetCard(cardId);
    if (!foundCard) return [];
    return foundCard.goals
}

export const useGetGoal = (cardId: string, goalId: string) => {
    const goals = useGetGoals(cardId);
    return goals.find(x => x.id === goalId);
}

export const useGetCardTransactions = (cardId: string) => {
    const foundCard = useGetCard(cardId);
    if (!foundCard) return [];

    return foundCard.transactions;
}

export const useGetCardCycleData = (cardId: string) => {
    const foundCard = useGetCard(cardId);
    if (!foundCard) return null;

    return {
        openDate: foundCard.openDate,
        closeDate: foundCard.closeDate,
        cycleStartDay: foundCard.cycleStartDay,
        cycleEndDay: foundCard.cycleEndDay
    }
}

export const useGetCardCategories = (cardId: string) => {
    const foundCard = useGetCard(cardId);
    if (!foundCard) return [];
    return foundCard.categories;
}

export const useGetCards = () => {
    return useCardStore((state) => state.cards)
}
export const useInitStore = () => {
    return useCardStore((state) => state.initStore)
}
export const useCreateCard = () => {
    return useCardStore((state) => state.createCard)
}
export const useDeleteCard = () => {
    return useCardStore((state) => state.deleteCard)
}
export const useUpdateCard = () => {
    return useCardStore((state) => state.updateCard)
}
export const useAddOrUpdateGoal = () => {
    return useCardStore((state) => state.addOrUpdateGoal)
}
export const useAddCategory = () => {
    return useCardStore((state) => state.addCategory)
}
export const useDeleteGoal = () => {
    return useCardStore((state) => state.deleteGoal)
}
export const useDeleteCategory = () => {
    return useCardStore((state) => state.deleteCategory)
}
export const useAddOrUpdateTransaction = () => {
    return useCardStore((state) => state.addOrUpdateTransaction)
}
export const useDeleteTransaction = () => {
    return useCardStore((state) => state.deleteTransaction)
}