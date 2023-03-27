import { CardContent, Box, Typography, CardActions, Button, Card } from '@mui/material';
import EditGoalDialog from 'Card/ModifyGoalDialog/EditGoalDialog';
import { IGoal, IRepeatedGoalConfig, ISingleGoalConfig } from 'CardStore';
import useGetGoalSummary from 'hooks/useGetGoalSummary';
import { useState } from 'react';
import CircularProgress from '../CircularProgress';
import RepeatedGoal from './RepeatedGoal';
import SingleGoal from './SingleGoal';
import SubGoal from './SubGoal';

const Goal: React.FC<IGoal & { cardId?: string }> = (props) => {

    if (props.metadata.goalMode === 'single-goal') {
        return (
            <SingleGoal {...props} />
        )
    } else {
        return (
            <RepeatedGoal {...props} />
        )
    }
}

export default Goal;