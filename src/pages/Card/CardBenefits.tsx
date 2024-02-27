import { Box, Title, Button, Card, Text } from "@mantine/core";
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
                        <Title order={4}>{benefit.name}</Title>
                        <Text lineClamp={5}>{benefit.description}</Text>
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