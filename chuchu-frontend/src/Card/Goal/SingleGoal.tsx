import { CardContent, Box, Typography, CardActions, Button, Card } from '@mui/material';
import EditGoalDialog from 'Card/ModifyGoalDialog/EditGoalDialog';
import { IGoal, ISingleGoalConfig } from 'CardStore';
import useGetGoalSummary from 'hooks/useGetGoalSummary';
import { useState } from 'react';
import CircularProgress from '../CircularProgress';

const SingleGoal: React.FC<IGoal & { cardId?: string }> = (props) => {
    const [ goalDialogIsOpen, setGoalDialogIsOpen ] = useState(false);
    const { id, name, metadata, reward, altReward, description, spendRequired } = props;
    const goalSummary = useGetGoalSummary(props.cardId || '', id);

    const goalFailed = goalSummary.deadlineHasPassed && !goalSummary.completed;

    return (
        <Card key={id} sx={{ 
            marginRight: '0.5rem',
            marginTop: '10px',
            width: '300px',
            maxWidth: '300px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: goalFailed ? 'error.light' : goalSummary.completed ? 'success.main' : ''
        }}>
            <CardContent sx={{ paddingBottom: 0, flexGrow: 1 }}>
                <Typography 
                    variant="caption"
                >
                    {(metadata.configs as ISingleGoalConfig).goalStartDate} - {(metadata.configs as ISingleGoalConfig).goalEndDate}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography>{name}</Typography>
                        <Typography variant="caption">{description}</Typography>
                    </Box>
                    <Box>
                        <CircularProgress value={goalSummary.percentageComplete} />
                    </Box>
                </Box>
                <Typography sx={{ fontWeight: 'bold' }}>Spend Required: {spendRequired}</Typography>
                <Typography sx={{ fontWeight: 'bold' }}>Reward: {reward ? reward : altReward}</Typography>
            </CardContent>
            <CardActions>
                <EditGoalDialog isOpen={goalDialogIsOpen} goal={props} onClose={() => setGoalDialogIsOpen(false)} />
                <Button color="secondary" onClick={() => setGoalDialogIsOpen(true)}>Edit Goal</Button>
            </CardActions>
        </Card>
    )
}

export default SingleGoal;