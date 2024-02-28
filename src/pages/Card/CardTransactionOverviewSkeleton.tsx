import { Card, Skeleton, Box } from "@mantine/core"

function CardTransactionOverviewSkeleton() {
    return (
        <>
            <Card mb="xs">
                <Skeleton height={24} mb="md" />
                <Box style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Box>
                        <Skeleton circle height={150} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                    </Box>
                    <Box>
                        <Skeleton circle height={150} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                    </Box>
                    <Box>
                        <Skeleton circle height={150} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                    </Box>
                </Box>
            </Card>
            <Card mb="xs">
                <Skeleton height={24} mb="md" />
                <Box style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Box>
                        <Skeleton circle height={150} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                    </Box>
                    <Box>
                        <Skeleton circle height={150} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                    </Box>
                    <Box>
                        <Skeleton circle height={150} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                    </Box>
                </Box>
            </Card>
            <Card mb="xs">
                <Skeleton height={24} mb="md" />
                <Box style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Box>
                        <Skeleton circle height={150} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                    </Box>
                    <Box>
                        <Skeleton circle height={150} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                    </Box>
                    <Box>
                        <Skeleton circle height={150} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                        <Skeleton height={16} mb="xs" />
                    </Box>
                </Box>
            </Card>
        </>
    )
}

export default CardTransactionOverviewSkeleton