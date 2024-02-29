import { Anchor, Box, Breadcrumbs, Button, Container, SegmentedControl } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { IconEdit, IconSwitchHorizontal } from "@tabler/icons-react";
import { getDatabase, onValue, ref, set } from "firebase/database";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { budgetId, getFirebaseApp } from "../../configs";
import { ECardType } from "../../constants";
import { ICard } from "../../models";
import ProductSwitchModal from "../Modals/ProductSwitchModal";
import CardBenefits from "./CardBenefits";
import CardEarnRates from "./CardEarnRates";
import CardGoals from "./CardGoals";
import CardHeading from "./CardHeading";
import CardTradeline from "./CardTradeline";
import CardTransactionOverview from "./CardTransactionOverview";

function Card() {
    const [card, setCard] = useState<Partial<ICard>>();
    const { cardId } = useParams<{ cardId: string }>();
    const [ view, setView ] = useState<'SUMMARY' | 'TRANSACTION_OVERVIEW' | 'TRADELINE'>('SUMMARY')
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        if (!cardId) return;

        const app = getFirebaseApp();
        const db = getDatabase(app);
        const reference = ref(db, `cards/${cardId}`)
        const unsub = onValue(reference, (snapshot) => {
            setCard(snapshot.val());
        })

        return () => unsub();
    }, [cardId])

    const handleSubmit = (
        name: string,
        description: string,
        openDate: string,
        creditLimit: number,
        cardType: ECardType,
        budgetId: string,
        companyId: string,
    ) => {
        if (!cardId || !cardId) return;


        const app = getFirebaseApp();
        const db = getDatabase(app);

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { tradeline, ...everythingElse } = card as ICard;

        const reference = ref(db, `cards/${cardId}`);
        set(reference, {
            ynabCardId: cardId,
            description: description,
            openDate: openDate,
            creditLimit: creditLimit,
            cardType: cardType,
            name: name,
            budgetId: budgetId,
            companyId: companyId,
            cycleStartDate: card?.cycleStartDate || null,
            cycleEndDate: card?.cycleEndDate || null,
            tradeline: card?.tradeline ? [...card.tradeline, { ...everythingElse, closeDate: openDate }] : [{ ...card, closeDate: openDate }]
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
        <Container m="xs" w="100%" maw="100%">
            <Box mb="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Breadcrumbs>
                    <Anchor component={NavLink} to="/cards-summary">Cards Summary</Anchor>
                    <Anchor>{card?.name}</Anchor>
                </Breadcrumbs>
                <Box>
                    <ProductSwitchModal onSubmit={handleSubmit} opened={modalIsOpen} onClose={() => setModalIsOpen(false)} />
                    <Button onClick={() => setModalIsOpen(true)} color="violet" w="170" mr="xs" rightSection={<IconSwitchHorizontal />}>Product Switch</Button>
                    <Button component={NavLink} to={`/cards/${cardId}/edit`} w="170" rightSection={<IconEdit />}>Edit details</Button>
                </Box>
            </Box>

            <Box ta="left">
                <CardHeading card={card} />

                <SegmentedControl
                    onChange={(val) => setView(val as 'SUMMARY' | 'TRANSACTION_OVERVIEW' | 'TRADELINE')}
                    my="lg"
                    data={[
                        { value: 'SUMMARY', label: 'Summary' },
                        { value: 'TRANSACTION_OVERVIEW', label: 'Transaction Overview' },
                        { value: 'TRADELINE', label: 'Card History' }
                    ]}
                    fullWidth
                    size="md"
                />

                {view === 'SUMMARY' && (
                    <>
                        <CardGoals card={card} />
                        <CardEarnRates earnRates={card?.earnRates || []} />
                        <CardBenefits cardId={card?.ynabCardId} cardOpenDate={card?.openDate as string} benefits={card?.benefits || []} />
                    </>
                )}
                {view === 'TRANSACTION_OVERVIEW' && (
                    <CardTransactionOverview accountId={cardId} budgetId={budgetId} card={card} />
                )}
                {view === 'TRADELINE' && (
                    <CardTradeline card={card} />
                )}
            </Box>
        </Container>
    )
}

export default Card;