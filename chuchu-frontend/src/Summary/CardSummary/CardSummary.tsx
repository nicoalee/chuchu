import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import './CardSummary.css';
import { useNavigate } from 'react-router-dom';
import React from "react";
import { ICard, useGetCardTransactions, useGetGoals } from "CardStore";
import CycleTable from "./CycleTable/CycleTable";
import useGetTotalRewards from "hooks/useGetTotalRewards";
import { getTotalBonusesFromGoals } from "Card/TotalRewards";

const CardSummary: React.FC<ICard> = (props) => {
    const totalRewards = useGetTotalRewards(props.id || '');
    const transactions = useGetCardTransactions(props.id || '');
    const goals = useGetGoals(props.id || '');
    const totalBonuses = getTotalBonusesFromGoals(transactions, goals)
    const navigate = useNavigate();

    return (
        <Box sx={{ marginBottom: '15px' }}>
            <Card className={`${props.company}`} variant="outlined">
                <CardContent>
                    <Typography variant="caption">{ props.openDate }</Typography>
                    <Typography variant="h5">{props.name}</Typography>
                    <Typography gutterBottom>{props.description}</Typography>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ 
                            width: '320px', 
                            border: '2px solid white', 
                            borderRadius: '4px', 
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <Typography variant="h6">
                                Total Rewards:
                            </Typography>
                            <Box>
                                <Box sx={{ display: 'flex' }}>
                                    <Typography variant="h4" sx={{ display: 'inline-block' }}>{totalRewards}</Typography>
                                    <Typography sx={{ display: 'inline-block', margin: '0 5px' }} variant="h4">+</Typography>
                                    <Typography variant="h4" sx={{ display: 'inline-block' }}>{totalBonuses}</Typography>
                                    <Typography sx={{ display: 'inline-block', marginLeft: '5px' }} variant="h4">=</Typography>
                                </Box>
                                <Typography variant="h4">{totalBonuses + totalRewards}</Typography>
                            </Box>
                        </Box>
                        <Box sx={{ width: '100%', paddingLeft: '0.5rem', overflowX: 'auto' }}>
                            <CycleTable cardId={props.id} />
                        </Box>
                    </Box>
                </CardContent>
                <CardActions>
                    <Button 
                        onClick={() => navigate(`/cards/${props.id}`)} 
                        sx={{ marginLeft: '0.5rem' }} 
                        size="large" 
                        disableElevation 
                        className={`${props.company}-button`} 
                        variant="contained"
                    >
                        View Card
                    </Button>
                </CardActions>
            </Card>
        </Box>
    )
}

export default CardSummary;