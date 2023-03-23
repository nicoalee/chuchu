import { CardContent, Box, Typography, CardActions, Button, Card } from '@mui/material';
import EditGoalDialog from 'Card/ModifyGoalDialog/EditGoalDialog';
import { IGoal } from 'CardStore';
import { useState } from 'react';
import CircularProgress from '../CircularProgress';

const Goal: React.FC<IGoal> = (props) => {
    const [ goalDialogIsOpen, setGoalDialogIsOpen ] = useState(false);
    const { id, name, goalEndDate, reward, altReward, goalStartDate, description, spendRequired } = props;

    return (
        <Card key={id} sx={{ 
            marginRight: '0.5rem',
            marginTop: '10px',
            width: '300px',
            maxWidth: '300px',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <CardContent sx={{ paddingBottom: 0, flexGrow: 1 }}>
                <Typography variant="caption">{goalStartDate} - {goalEndDate}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography>{name}</Typography>
                        <Typography variant="caption">{description}</Typography>
                    </Box>
                    <Box>
                        <CircularProgress value={34} />
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

export default Goal;