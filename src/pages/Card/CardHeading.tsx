import { Box, Title, Badge, Image, Text } from "@mantine/core"
import { IconPlane, IconCash } from "@tabler/icons-react"
import { ICard } from "../../models"
import classes from './CardHeading.module.css'
import { useMemo } from "react"

function CardHeading({ card }: { card: Partial<ICard> | undefined}) {
    const cardOpenDate = useMemo(() => {
        if (!card?.openDate) return 'no date'
        const openDate = card.openDate as string;
        return new Date(openDate).toLocaleDateString('en-us')
    }, [card?.openDate])

    return (
        <Box mb="sm" style={{ display: 'flex' }}>
            <Box mr="md">
                {card?.cardImageUrl ? (
                    <Image style={{ width: '180px' }} src={card?.cardImageUrl} />
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
                    {card?.cardType === 'POINTS' ? <IconPlane /> : <IconCash />}
                    {card?.name || 'No name'}
                </Title>
                <Text>{card?.description || 'No description'}</Text>
                <Box>
                    <Badge mr="xs" color="indigo">Open date: {cardOpenDate}</Badge>
                    <Badge mr="xs">Annual Fee: {card?.annualFee}</Badge>
                    <Badge mr="xs" color="cyan">Credit Limit: {card?.creditLimit}</Badge>
                    <Badge color="orange">Billing Cycle: {card?.cycleStartDate} - {card?.cycleEndDate}</Badge>
                </Box>
            </Box>
        </Box>
    )
}

export default CardHeading