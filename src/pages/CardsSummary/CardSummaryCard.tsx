import { Card, Text, Title } from '@mantine/core';
import { getDatabase, onValue, ref } from 'firebase/database';
import { useEffect, useState } from 'react';
import * as ynab from 'ynab';
import { getFirebaseApp } from '../../configs';
import { ICard } from '../../models';
import classes from './CardSummaryCard.module.css';
import CardSummaryCompanyImage from './CardSummaryCompanyImage';
import CreateCardInFirebaseModal from './CreateCardInFirebaseModal';
import { useNavigate } from 'react-router-dom';

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

    const handleCloseModal = () => {
        setModalIsOpen(false)
    }

    return (
        <>
            <CreateCardInFirebaseModal account={account} opened={modalIsOpen} onClose={handleCloseModal} />
            <Card onClick={handleSelectCard} className={classes['card-summary-card']} h="300" w="250px" m="sm">
                <CardSummaryCompanyImage cardUrl={creditCard?.cardImageUrl} accountName={account.name} />
                <div>
                    <Title h="60" mt="sm" mb="sm" ta="left" order={4}>{account.name}</Title>
                    <Text ta='left' c={creditCard ? 'inherit' : 'orange'}>
                        {
                            creditCard ? creditCard?.description : 'No details have been added yet'
                        }
                    </Text>
                </div>

            </Card>
        </>
    )
}

export default CardSummaryCard;