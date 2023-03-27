import { CardContent, Box, Typography, CardActions, Button, Card } from '@mui/material';
import EditGoalDialog from 'Card/ModifyGoalDialog/EditGoalDialog';
import { IGoal, IRepeatedGoalConfig } from 'CardStore';
import useGetGoalSummary from 'hooks/useGetGoalSummary';
import { useState } from 'react';
import CircularProgress from '../CircularProgress';
import SubGoal from './SubGoal';

const RepeatedGoal: React.FC<IGoal & { cardId?: string }> = (props) => {
    const [ goalDialogIsOpen, setGoalDialogIsOpen ] = useState(false);
    const { id, name, metadata, reward, altReward, description, spendRequired } = props;
    const goalSummary = useGetGoalSummary(props.cardId || '', id);

    const goalFailed = goalSummary.deadlineHasPassed && !goalSummary.subGoals.every(x => x.completed);

    return (
        <Card key={id} sx={{ 
            marginRight: '0.5rem',
            marginTop: '10px',
            width: '300px',
            maxWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: goalFailed ? 'error.light' : goalSummary.subGoals.every(x => x.completed) ? 'success.main' : ''
        }}>
            <CardContent sx={{ paddingBottom: 0, flexGrow: 1 }}>
                <Box>
                    <Typography variant="caption">
                        {(metadata.configs as IRepeatedGoalConfig).goalStartDate} -{' '}
                        {(metadata.configs as IRepeatedGoalConfig).numOccurrences} -{' '}
                        {(metadata.configs as IRepeatedGoalConfig).repeatType}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography>{name}</Typography>
                        <Typography variant="caption">{description}</Typography>
                    </Box>
                    {
                        !goalSummary.deadlineHasPassed && (
                            <Box>
                                <CircularProgress value={goalSummary.percentageComplete} />
                            </Box>
                        )
                    }
                </Box>
                <Typography sx={{ fontWeight: 'bold' }}>Spend Required: {spendRequired}</Typography>
                <Typography sx={{ fontWeight: 'bold' }}>Reward: {reward ? reward : altReward}</Typography>
                <Box>
                    {goalSummary.subGoals.map((subGoal, index) => (
                        <SubGoal key={index} completed={subGoal.completed} status={subGoal.status} />
                    ))
                    }
                </Box>
            </CardContent>
            <CardActions>
                <EditGoalDialog isOpen={goalDialogIsOpen} goal={props} onClose={() => setGoalDialogIsOpen(false)} />
                <Button color="secondary" onClick={() => setGoalDialogIsOpen(true)}>Edit Goal</Button>
            </CardActions>
        </Card>
    )
}

export default RepeatedGoal;