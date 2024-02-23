import { useEffect, useState } from "react";
import useGetTransactionsByAccount from "../../hooks/useGetTransactionsByAccount";
import { useNavigate, useParams } from "react-router-dom";
import { budgetId, getFirebaseApp } from "../../configs";
import { NavLink } from "react-router-dom"
import { Box, Container, Group, Title, Text, Button, Breadcrumbs, Anchor } from "@mantine/core";
import { getDatabase, onValue, ref } from "firebase/database";
import { ICard } from "../../models";
import { IconEdit } from "@tabler/icons-react";

function Card() {
    const navigate = useNavigate();
    const [card, setCard] = useState<Partial<ICard>>();
    const { cardId } = useParams<{ cardId: string }>();
    const { data, isLoading } = useGetTransactionsByAccount(budgetId || '', cardId || '', undefined);

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

    return (
        <Container m="xs" w="100%" maw="100%">
            <Box>
                <Breadcrumbs>
                    <Anchor component={NavLink} to="/cards-summary">Cards Summary</Anchor>
                    <Anchor>{card?.name}</Anchor>
                </Breadcrumbs>
            </Box>

            <Box ta="left">
                <Group justify="end">
                    <Button component={NavLink} to={`/cards/${cardId}/edit`} w="300" mb='md' rightSection={<IconEdit />}>Edit details</Button>
                </Group>
                <Title ta="left" order={1}>{card?.name || 'No name'}</Title>

                <Text>{card?.description || 'No description'}</Text>
            </Box>
        </Container>
    )
}

export default Card;