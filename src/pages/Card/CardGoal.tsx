import { Box, Title, Text } from "@mantine/core";
import { IconRepeatOff, IconRepeat } from "@tabler/icons-react";
import { ISingleGoal, IRepeatedGoal, IGoal } from "../../models";
import CardRepeatedGoal from "./CardGoalShowRepeatedDate";
import CardSingleGoal from "./CardGoalShowSingleDate";

function CardGoal({goal}: { goal: IGoal }) {
    return (
        <Box style={{
            backgroundColor: 'var(--mantine-color-dark-4)',
            borderRadius: '8px',
            width: '250px'
        }} miw="250" mr="xs" mb="xs" p="md" key={goal.id}>
            <Box mb="xs" style={{ display: 'flex', alignItems: 'center' }} h="35">
                {goal.goalType === 'SINGLE' ? (
                    <>
                        <IconRepeatOff style={{ marginRight: '4px' }} />
                        <CardSingleGoal goalConfig={goal.goalConfig as ISingleGoal} />
                    </>
                ) : (
                    <>
                        <IconRepeat style={{ marginRight: '4px' }} />
                        <CardRepeatedGoal goalConfig={goal.goalConfig as IRepeatedGoal} />
                    </>
                )}
            </Box>
            <Title style={{ display: 'flex', alignItems: 'center' }} order={4}>
                {goal.name}
            </Title>
            <Text lineClamp={3}>{goal.description}</Text>
            <Title c="green" order={3}>Reward: {goal.reward}</Title>
            <Title c="red" order={5}>Spend Goal: {goal.spendRequired}</Title>
        </Box>
    )
}

export default CardGoal;