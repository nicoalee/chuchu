import { Card, Spoiler, Text, Title } from '@mantine/core';
import { getDatabase, onValue, ref, set } from 'firebase/database';
import { useEffect, useState } from 'react';
import * as ynab from 'ynab';
import { getFirebaseApp } from '../../configs';
import { ICard } from '../../models';
import classes from './CardSummaryCard.module.css';
import CardSummaryCompanyImage from './CardSummaryCompanyImage';
import CreateCardInFirebaseModal from '../Modals/CreateCardInFirebaseModal';
import { useNavigate } from 'react-router-dom';
import { ECardType } from '../../constants';
import { Notifications } from '@mantine/notifications';

function CardSummaryCard(account: ynab.Account) {
    const navigate = useNavigate();
    const [ creditCard, setCreditCard ] = useState<ICard>();
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        const app = getFirebaseApp();
        const db = getDatabase(app);

        const reference = ref(db, `cards/${account.id}`)

        const unsub = onValue(reference, (snapshot) => {
            const snapshotVal = snapshot.val();
            if (!snapshotVal) {
                setCreditCard(undefined);
            } else {
                setCreditCard(snapshotVal)
            }
        })

        return () => {
            unsub();
        }
    
    }, [account.id])

    const handleSelectCard = () => {
        if (!creditCard) {
            setModalIsOpen(true)
        } else {
            navigate(`/cards/${account.id}`)
        }
    }

    const handleSubmit = (
        name: string,
        description: string,
        openDate: string,
        creditLimit: number,
        cardType: ECardType,
        budgetId: string,
        companyId: string
    ) => {
        const app = getFirebaseApp();
        const db = getDatabase(app);

        const reference = ref(db, `cards/${account.id}`);
        set(reference, {
            ynabCardId: account.id,
            description: description,
            openDate: openDate,
            creditLimit: creditLimit,
            cardType: cardType,
            name: name,
            budgetId: budgetId,
            companyId: companyId,
            tradeline: []
        } as Partial<ICard>).then(() => {
            Notifications.show({
                title: 'Sucess',
                message: 'Card details saved',
                color: 'green',
                
            })
            setModalIsOpen(false);
        }).catch(() => {
            Notifications.show({
                title: 'There was an error',
                message: 'Encountered an error while trying to save card details. Please contact Nick',
                color: 'red'
            })
        })
    }



    return (
        <>
            <CreateCardInFirebaseModal onSubmit={handleSubmit} accountId={account.id} opened={modalIsOpen} onClose={() => setModalIsOpen(false)} />
            <Card onClick={handleSelectCard} className={classes['card-summary-card']} w="250px" m="sm">
                <CardSummaryCompanyImage cardUrl={creditCard?.cardImageUrl} accountName={account.name} />
                <div>
                    <Title h="30" mt="sm" mb="sm" ta="left" lineClamp={1} order={4}>{creditCard?.name || account.name}</Title>
                    <Spoiler onClick={(e) => e.stopPropagation()} showLabel="Show more" hideLabel="Hide" ta='left' style={{ whiteSpace: 'pre-wrap' }} c={creditCard?.description ? 'inherit' : 'yellow'}>
                        {
                            creditCard ? creditCard?.description : 'No details have been added yet. Click on this card to get started'
                        }
                    </Spoiler>
                </div>
            </Card>
        </>
    )
}

export default CardSummaryCard;