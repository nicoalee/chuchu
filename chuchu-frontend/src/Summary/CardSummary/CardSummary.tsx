import { Box, Button, Card, CardActions, CardContent, Typography } from "@mui/material";
import './CardSummary.css';
import { useNavigate } from 'react-router-dom';
import React from "react";
import { ICard, ITransaction } from "CardStore";
import CycleTable from "./CycleTable/CycleTable";

const getTotalRewards = (transactions: ITransaction[]) => {
    const rewards = transactions.map(transaction => transaction.amount * transaction.category.rewardRatio)
    return Math.round(rewards.reduce((acc, curr) => acc + curr, 0))
}

const CardSummary: React.FC<ICard> = (card) => {
    const navigate = useNavigate();
    const totalRewards = getTotalRewards(card.transactions)

    return (
        <Box sx={{ marginBottom: '15px' }}>
            <Card className={`${card.company}`} variant="outlined">
                <CardContent>
                    <Typography variant="caption">{ card.openDate }</Typography>
                    <Typography variant="h5">{card.name}</Typography>
                    <Typography gutterBottom>{card.description}</Typography>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ 
                            width: '180px', 
                            border: '2px solid white', 
                            padding: '0.5rem 1.5rem', 
                            borderRadius: '4px', 
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <Typography>Total Rewards</Typography>
                            <Typography variant="h4">{ totalRewards }</Typography>
                        </Box>
                        <Box sx={{ width: '100%', paddingLeft: '0.5rem', overflowX: 'auto' }}>
                            <CycleTable />
                        </Box>
                    </Box>
                </CardContent>
                <CardActions>
                    <Button 
                        onClick={() => navigate(`/cards/${card.id}`)} 
                        sx={{ marginLeft: '0.5rem' }} 
                        size="large" 
                        disableElevation 
                        className={`${card.company}-button`} 
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