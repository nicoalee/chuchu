import { Box, Title, Badge, Image, Text, Alert } from "@mantine/core"
import { IconPlane, IconCash, IconAlertOctagonFilled } from "@tabler/icons-react"
import { ICard } from "../../models"
import classes from './CardHeading.module.css'
import { useMemo } from "react"
import { DateTime } from "luxon"

function CardHeading({ card }: { card: Partial<ICard> | undefined}) {
    const cardOpenDate = useMemo(() => {
        if (!card?.openDate) return 'no date'
        const openDate = card.openDate as string;
        return new Date(openDate).toLocaleDateString('en-us')
    }, [card?.openDate]);

    const closeDate = useMemo(() => {
        if (!card?.closeDate) return '';
        return DateTime.fromISO(card.closeDate as string).toLocaleString();
    }, [card?.closeDate]);

    return (
        <Box mb="sm">
            {card?.closeDate && (
                <Box ta="left">
                    <Alert mb="md" title="Closed" color="red" icon={<IconAlertOctagonFilled />}>
                        This card was closed on {closeDate}
                    </Alert>
                </Box>
            )}
            <Box style={{ display: 'flex' }}>
                <Box mr="md">
                    {card?.cardImageUrl ? (
                        <Image style={{ width: '180px', borderRadius: '8px' }} src={card?.cardImageUrl} />
                    ): (
                        <Box className={classes['card-image']}>
                            <Box style={{ backgroundColor: 'transparent', width: '100%', height: '25%' }}></Box>
                            <Box style={{ backgroundColor: 'white', width: '100%', height: '25%' }}></Box>
                            <Box style={{ backgroundColor: 'transparent', width: '100%', height: '50%' }}></Box>
                        </Box>
                    )}
                </Box>
                <Box>
                    <Title ta="left" order={1}>
                        {card?.cardType === 'POINTS' ? <IconPlane style={{ marginRight: '8px' }} /> : <IconCash style={{ marginRight: '8px' }} />}
                        {card?.closeDate && (<>[OLD] </>)}
                        {card?.name || 'No name'}
                    </Title>
                    <Text ta="left">{card?.description || 'No description'}</Text>
                    <Box>
                        {cardOpenDate && (<Badge mr="xs" color="indigo">Open date: {cardOpenDate}</Badge>)}
                        {card?.annualFee !== undefined && (<Badge mr="xs">Annual Fee: {card?.annualFee}</Badge>)}
                        {card?.creditLimit && (<Badge mr="xs" color="cyan">Credit Limit: {card?.creditLimit}</Badge>)}
                        <Badge color="orange">Billing Cycle: {card?.cycleStartDate} - {card?.cycleEndDate}</Badge>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default CardHeading