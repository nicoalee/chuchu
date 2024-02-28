import { Box, Title, Button, Card, Text, Spoiler } from "@mantine/core";
import { IBenefit } from "../../models";

function CardBenefits({benefits}: { benefits: IBenefit[] }) {
    return (
        <>
            <Title order={3}>Benefits</Title>
            <Box my="lg" style={{ display: 'flex', overflowX: 'auto' }}>
                {(benefits || []).map((benefit) => (
                    <Card style={{
                        backgroundColor: 'var(--mantine-color-dark-6)',
                        borderRadius: '8px',
                        width: '250px',
                    }} mr="xs" mb="xs" miw="250px" key={benefit.id}>
                        <Title mb="xs" order={4}>{benefit.name}</Title>
                        <Spoiler mb="xs" showLabel="Show more" hideLabel="hide text">{benefit.description}</Spoiler>
                        {benefit.isRedeemable && (
                            <Button style={{ marginTop: 'auto' }} fullWidth>Redeem</Button>
                        )}
                    </Card>
                ))}
            </Box>
        </>
    )
}

export default CardBenefits