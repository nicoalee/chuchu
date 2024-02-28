import { Box, Button, Image, Text, Timeline, Title } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { getDatabase, ref, update } from "firebase/database";
import { DateTime } from "luxon";
import { useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { getFirebaseApp } from "../../configs";
import { ICard } from "../../models";
import ConfirmationModal from "../Modals/ConfirmationModal";
import CardOutline from "./CardOutline";

function CardTradeline({ card }: { card: Partial<ICard> | undefined }) {
    const { cardId } = useParams<{cardId: string}>();
    const [ openState, setOpenState ] = useState<{ isOpen: boolean, index: number }>({
        isOpen: false,
        index: -1
    });

    const handleClose = (ok: boolean) => {
        setOpenState((prev) => ({ ...prev, isOpen: false }))
        if (!ok) return;
        if (openState.index < 0) return;
        const app = getFirebaseApp();
        const db = getDatabase(app);

        const reference = ref(db, `cards/${cardId}`);
        const updatedTradeline = [...(card?.tradeline || [])];
        updatedTradeline.splice(openState.index, 1);

        update(reference, {
            tradeline: updatedTradeline
        } as Partial<ICard>).then(() => {
            Notifications.show({
                title: 'Sucess',
                message: 'Card details deleted',
                color: 'green',
            })
        }).catch(() => {
            Notifications.show({
                title: 'There was an error',
                message: 'Encountered an error while trying to save card details. Please contact Nick',
                color: 'red'
            })
        })
    }

    if ((card?.tradeline || []).length === 0) {
        return (
            <Box>
                <Text c="yellow">Card has no history</Text>
            </Box>
        )
    }

    return (
        <Box mt="xl" style={{ display: 'flex', justifyContent: 'center' }}>
            <ConfirmationModal isOpen={openState.isOpen} onClose={handleClose} />
            <Timeline active={1} color="blue" lineWidth="8px" bulletSize="30px">
                {(card?.tradeline || []).map((card, index) => {
                    const openDate = DateTime.fromISO(card?.openDate as string);
                    const closeDate = DateTime.fromISO(card?.closeDate as string);
                    const cardIntervalText = `${openDate.toLocaleString()} - ${closeDate.toLocaleString()}`;
                    const months = Math.round(closeDate.diff(openDate, 'months').months)

                    return (
                        <Timeline.Item key={index}>
                            <Box>
                                <Box style={{ display: 'flex' }}>
                                    {card.cardImageUrl ? (
                                        <Image src={card.cardImageUrl} w="180" style={{ borderRadius: '8px' }} />
                                    ) : (
                                        <CardOutline />
                                    )}
                                    <Box ml="md">
                                        <Title order={2}>{card.name || ''}</Title>
                                        <Title order={4}>{card.description}</Title>
                                        <Text>{cardIntervalText} (~{months} months)</Text>
                                    </Box>
                                </Box>
                                <Box mt="sm">
                                    <Button w="180" component={NavLink} to={`/cards/${cardId}/history/${index}`}>View card</Button>
                                    <Button onClick={() => setOpenState({ isOpen: true, index })} ml="md" color="red">Delete card from tradeline</Button>
                                </Box>
                            </Box>
                        </Timeline.Item>
                    )
                })}
            </Timeline>
        </Box>
    )
}

export default CardTradeline;