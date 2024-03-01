import { getDatabase, ref, update } from "@firebase/database";
import { Box, Title } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { v4 as uuid } from 'uuid';
import { getFirebaseApp } from "../../configs";
import { IBenefit, ICard } from "../../models";
import CardBenefit from "./CardBenefit";

function CardBenefits({benefits, cardId, cardOpenDate}: { benefits: IBenefit[], cardId: string | undefined, cardOpenDate: string }) {
    const handleAddRedemption = (
        benefitId: string,
        notes: string,
        redemptionDate: string
    ) => {
        if (!cardId) return;

        const app = getFirebaseApp();
        const db = getDatabase(app);

        const reference = ref(db, `cards/${cardId}`);
        const updatedBenefits = [...benefits];
        const foundBenefit = updatedBenefits.find(x => x.id === benefitId);
        if (!foundBenefit) return;

        const redemptionList = foundBenefit.redemptions ? foundBenefit.redemptions : [];
        redemptionList.push({
            id: uuid(),
            notes: notes,
            dateRedeemed: redemptionDate
        });
        foundBenefit.redemptions = redemptionList

        update(reference, {
            benefits: updatedBenefits,
        } as Partial<ICard>).then(() => {
            Notifications.show({
                title: 'Sucess',
                message: 'Redemption recorded',
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

    const handleDeleteRedemption = (benefitId: string, redemptionId: string) => {
        if (!cardId) return;

        const app = getFirebaseApp();
        const db = getDatabase(app);
        const reference = ref(db, `cards/${cardId}`);

        const updatedBenefits = [...benefits];
        const foundBenefitIndex = updatedBenefits.findIndex(x => x.id === benefitId);
        if (foundBenefitIndex < 0) return;

        const updatedRedemptions = [...(updatedBenefits[foundBenefitIndex]?.redemptions || [])].filter(x => x.id !== redemptionId);
        updatedBenefits[foundBenefitIndex] = {
            ...updatedBenefits[foundBenefitIndex],
            redemptions: updatedRedemptions
        }
        update(reference, {
            benefits: updatedBenefits,
        } as Partial<ICard>).then(() => {
            Notifications.show({
                title: 'Sucess',
                message: 'Redemption deleted',
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

    return (
        <>
            <Title ta="left" order={3}>Benefits</Title>
            <Box my="lg" style={{ display: 'flex', flexWrap: 'wrap' }}>
                {(benefits || []).map((benefit) => (
                    <CardBenefit
                        key={benefit.id}
                        onDeleteRedemption={handleDeleteRedemption}
                        onAddRedemption={handleAddRedemption}
                        benefit={benefit}
                        cardOpenDate={cardOpenDate}
                    />
                ))}
            </Box>
        </>
    )
}

export default CardBenefits