import { Box, Card, Title, Text } from "@mantine/core";
import { IEarnRate } from "../../models";

function CardEarnRates({ earnRates }: { earnRates: IEarnRate[] }) {
    return (
        <>
            <Title ta="left" order={3}>Earn Rates</Title>
            <Box my="lg" style={{ display: 'flex', overflowX: 'auto' }}>
                {(earnRates || []).map((earnRate) => (
                    <Card
                        mr="xs"
                        mb="xs"
                        miw="250px"
                        p="md"
                        key={earnRate.id}
                        style={{
                            borderColor: 'var(--mantine-color-dark-6)',
                            border:'2px solid',
                            borderRadius: '8px',
                            width: '250px'
                        }}
                    >
                        <Title order={4}>{earnRate.name}</Title>
                        <Text lineClamp={3}>{earnRate.description}</Text>
                    </Card>
                ))}
            </Box>
        </>
    )
}

export default CardEarnRates