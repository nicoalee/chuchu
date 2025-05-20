import { Box, Button, Card, Spoiler, Text, Title } from "@mantine/core";
import { useMemo, useState } from "react";
import { IBenefit } from "../../models";
import AddNewRedemption from "../Modals/AddNewRedemption";
import CardBenefitRedemptionHistory from "./CardBenefitRedemptionHistory";
import { DateTime } from "luxon";

function CardBenefit({
    benefit,
    onAddRedemption,
    onDeleteRedemption,
    cardOpenDate
}: {
    benefit: IBenefit,
    onAddRedemption: (
        benefitId: string, 
        notes: string, 
        redemptionDate: string
    ) => void,
    onDeleteRedemption: (
        benefitId: string,
        redemptionId: string
    ) => void,
    cardOpenDate: string
}) {
    const [openState, setIsOpenState] = useState<{
        benefitName: string,
        benefitId: string,
        isOpen: boolean
    }>({
        benefitName: '',
        benefitId: '',
        isOpen: false
    });

    const handleAddRedemption = (notes: string, dateRedeemed: string) => {
        onAddRedemption(openState.benefitId, notes, dateRedeemed)
        setIsOpenState({ isOpen: false, benefitId: '', benefitName: '' });
    }

    const thisRedemptionCycle = useMemo(() => {
        if (!benefit.isRedeemable) return null;
        if (!benefit.numMonthsAllowedRedemptionsReset) return null;
        let startDate = DateTime.fromISO(cardOpenDate);
        let endDate = startDate.plus({ months: benefit.numMonthsAllowedRedemptionsReset });
        const now = DateTime.now();

        while(now > endDate) {
            startDate = startDate.plus({months: benefit.numMonthsAllowedRedemptionsReset });
            endDate = endDate.plus({ months: benefit.numMonthsAllowedRedemptionsReset });
        }

        return {
            redemptionCycleStartDate: startDate,
            redemptionCycleEndDate: endDate,
        }
    }, [benefit.isRedeemable, benefit.numMonthsAllowedRedemptionsReset, cardOpenDate])

    const numRedemptionsAvailableThisCycle = useMemo(() => {
        if (!benefit.isRedeemable) return 0;
        if (!benefit.numAllowedRedemptions) return 0;
        if (!thisRedemptionCycle) return 0;
    
        return (benefit.redemptions || []).reduce((acc, curr) => {
            const dateRedeemed = DateTime.fromISO(curr.dateRedeemed as string);
            if (dateRedeemed >= thisRedemptionCycle.redemptionCycleStartDate && dateRedeemed <= thisRedemptionCycle.redemptionCycleEndDate) {
                return acc - 1;
            }
            return acc;
        }, benefit.numAllowedRedemptions)

    }, [benefit.isRedeemable, benefit.numAllowedRedemptions, benefit.redemptions, thisRedemptionCycle])

    return (
        <Card
            style={{
                backgroundColor: 'var(--mantine-color-dark-6)',
                borderRadius: '8px',
                width: '250px',
            }}
            mr="xs"
            mb="xs"
            p="xl"
            miw="350px" 
            key={benefit.id}
        >
            {benefit.isRedeemable && (
                <Box>
                    {numRedemptionsAvailableThisCycle === 0 ? (
                        <Text
                            size="xs"
                            mb="xs"
                            c="orange"
                        >
                            No redemptions available. Renews on {thisRedemptionCycle?.redemptionCycleEndDate.toLocaleString()}
                        </Text>
                    ) : (
                        <>
                            <Text c="green" size="xs">
                                Redeem between{' '}
                                {thisRedemptionCycle?.redemptionCycleStartDate.toLocaleString()} -{' '}
                                {thisRedemptionCycle?.redemptionCycleEndDate.toLocaleString()}
                            </Text>
                            <Text c="green" mb="xs" size="xs">
                                Resets every {benefit.numMonthsAllowedRedemptionsReset} months
                            </Text>
                        </>
                    )}
                </Box>
            )}
            <Title order={4}>{benefit.name}</Title>
            <Spoiler style={{ whiteSpace: 'pre-wrap' }} showLabel="Show more" hideLabel="hide text">{benefit.description}</Spoiler>

            {benefit.isRedeemable && (
                <>
                    <AddNewRedemption
                        title={`Record redemption for ${openState.benefitName}`}
                        isOpen={openState.isOpen}
                        onClose={() => setIsOpenState((prev) => ({...prev, isOpen: false}))}
                        onAdd={handleAddRedemption}
                    />
                    <Button
                        onClick={() => setIsOpenState({
                            isOpen: true,
                            benefitName: benefit.name,
                            benefitId: benefit.id
                        })}
                        disabled={numRedemptionsAvailableThisCycle === 0}
                        mt="lg"
                        style={{ marginTop: 'auto' }}
                        fullWidth
                    >
                        {numRedemptionsAvailableThisCycle} redemption(s) available
                    </Button>
                    <CardBenefitRedemptionHistory onDeleteRedemption={onDeleteRedemption} benefit={benefit} />
                </>
            )}
        </Card>
    )
}

export default CardBenefit;