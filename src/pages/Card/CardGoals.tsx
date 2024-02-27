import { Box, Title } from "@mantine/core";
import { IGoal } from "../../models";
import CardGoal from "./CardGoal";

function CardGoals({goals}: { goals: IGoal[] }) {
    return (
        <>
            <Title order={3}>Goals</Title>
            <Box my="lg" style={{ display: 'flex', overflowX: 'auto' }}>
                {(goals || []).map((goal) => (
                    <CardGoal goal={goal} key={goal.id} />
                ))}
            </Box>
        </>
    )
}

export default CardGoals;