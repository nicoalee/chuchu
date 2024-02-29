import { Accordion, Timeline, Button, Text } from "@mantine/core";
import { DateTime } from "luxon";
import { IBenefit } from "../../models";

function CardBenefitRedemptionHistory({
    benefit,
    onDeleteRedemption
}: { 
    benefit: IBenefit, 
    onDeleteRedemption: (
        benefitIt: string,
        redemptionId: string
    ) => void
}) {
    return (
        <Accordion mt="lg" variant="contained">
            <Accordion.Item value="open">
                <Accordion.Control>Redemption History</Accordion.Control>
                <Accordion.Panel>
                    {(benefit.redemptions || []).length === 0 ? (
                        <Text c="yellow">No redemptions recorded</Text>
                    ) : (
                        <Timeline>
                            {(benefit.redemptions).sort((a, b) => {
                                return new Date(a.dateRedeemed as string).valueOf() - new Date(b.dateRedeemed as string).valueOf()
                            }).map((redemption) => (
                                <Timeline.Item
                                    title={redemption.notes}
                                    key={redemption.id}
                                >
                                    { redemption?.dateRedeemed ?DateTime.fromISO(redemption?.dateRedeemed as string).toLocaleString() : ''}
                                    <br />
                                    <Button
                                        onClick={() => onDeleteRedemption(benefit.id, redemption.id)}
                                        mt="xs"
                                        color="red"
                                        variant="light"
                                        fullWidth
                                        size="xs"
                                    >
                                        Delete
                                    </Button>
                                </Timeline.Item>
                            ))}
                        </Timeline>
                    )}
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    )
}

export default CardBenefitRedemptionHistory;