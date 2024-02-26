import { useEffect, useState } from "react";
import useGetTransactionsByAccount from "../../hooks/useGetTransactionsByAccount";
import { useNavigate, useParams } from "react-router-dom";
import { budgetId, getFirebaseApp } from "../../configs";
import { NavLink } from "react-router-dom"
import { Box, Container, Group, Title, Text, Button, Breadcrumbs, Anchor, Image, Badge, Card as MantineCard } from "@mantine/core";
import { getDatabase, onValue, ref } from "firebase/database";
import { ICard } from "../../models";
import { IconCash, IconCreditCard, IconEdit, IconPlane } from "@tabler/icons-react";
import CardSingleGoal from "./CardSingleGoal";
import CardRepeatedGoal from "./CardRepeatedGoal";

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
                <Box style={{ display: 'flex' }}>
                    <Box mr="md">
                        {card?.cardImageUrl ? (
                            <Image style={{ width: '180px' }} src={card?.cardImageUrl} />
                        ): (
                            <Box style={{
                                border: '4px solid white',
                                width: '180px',
                                height: '110px',
                                borderRadius: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Box style={{ backgroundColor: 'transparent', width: '100%', height: '25%' }}></Box>
                                <Box style={{ backgroundColor: 'white', width: '100%', height: '25%' }}></Box>
                                <Box style={{ backgroundColor: 'transparent', width: '100%', height: '50%' }}></Box>
                            </Box>
                        )}
                    </Box>
                    <Box>
                        <Title ta="left" order={1}>
                            {card?.cardType === 'POINTS' ? <IconPlane /> : <IconCash />}
                            {card?.name || 'No name'}
                        </Title>
                        <Text>{card?.description || 'No description'}</Text>
                        <Box>
                            <Badge mr="xs">Annual Fee: {card?.annualFee}</Badge>
                            <Badge mr="xs" color="cyan">Credit Limit: {card?.creditLimit}</Badge>
                            <Badge color="orange">Billing Cycle: {card?.cycleStartDate} - {card?.cycleEndDate}</Badge>
                        </Box>
                    </Box>
                </Box>

                <Box my="sm" style={{ display: 'flex', overflowX: 'auto' }}>
                    {(card?.earnRates || []).map((earnRate) => (
                        <MantineCard mr="xs" miw="250px" style={{ borderColor: 'var(--mantine-color-dark-6)', border:'2px solid', borderRadius: '8px', width: '250px' }} p="md" key={earnRate.id}>
                            <Title order={4}>{earnRate.name}</Title>
                            <Text lineClamp={3}>{earnRate.description}</Text>
                        </MantineCard>
                    ))}
                
                </Box>

                <Box my="sm" style={{ display: 'flex', overflowX: 'auto' }}>
                    {(card?.benefits || []).map((benefit) => (
                        <MantineCard style={{
                            backgroundColor: 'var(--mantine-color-dark-6)',
                            borderRadius: '8px',
                            width: '250px'
                        }} mr="xs" miw="250px" key={benefit.id}>
                            <Title order={4}>{benefit.name}</Title>
                            <Text lineClamp={5}>{benefit.description}</Text>
                            {benefit.isRedeemable && (
                                <Button style={{ marginTop: 'auto' }} fullWidth>Redeem</Button>
                            )}
                        </MantineCard>
                    ))}
                </Box>
                
                <Box style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {(card?.goals || []).map((goal) => (
                        <Box style={{
                            backgroundColor: 'var(--mantine-color-dark-4)',
                            borderRadius: '8px',
                            width: '250px'
                        }} mr="xs" mb="xs" p="md" key={goal.id}>
                            <Title order={4}>{goal.name}</Title>
                            <Text lineClamp={3}>{goal.description}</Text>
                            <Title c="green" order={3}>Reward: {goal.reward}</Title>
                            <Title c="red" order={5}>Spend Goal: {goal.spendRequired}</Title>
                            {
                                goal.goalType === 'SINGLE' ? (
                                    <CardSingleGoal />
                                ) : (
                                    <CardRepeatedGoal />
                                )
                            }
                        </Box>
                    ))}
                </Box>
            </Box>
        </Container>
    )
}

export default Card;