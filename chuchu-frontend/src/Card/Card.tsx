import { Box, Breadcrumbs, Chip, Link, Typography, Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useDeleteCard, useDeleteCategory, useGetCard } from '../CardStore'; 
import { useState } from 'react';
import Goal from './Goal/Goal'
import AddTransaction from './AddTransaction/AddTransaction';
import TransactionTable from './TransactionTable/TransactionTable';
import React from 'react'
import EditCardDetailsDialog from './EditCardDetailsDialog/EditCardDetailsDialog';
import AddGoalDialog from './ModifyGoalDialog/AddGoalDialog';
import AddCategoryDialog from './AddCategoryDialog/AddCategoryDialog';
import useGetTotalRewards from 'hooks/useGetTotalRewards';
import './Card.css';
import TotalExpenditure from './TotalExpenditure';
import TotalRewards from './TotalRewards';
import RequiredSpend from './RequiredSpend';

const Card: React.FC = (props) => {
    const { cardId } = useParams<{ cardId: string }>();
    const [ addGoalDialogIsOpen, setAddGoalDialogIsOpen ] = useState(false);
    const [ editGoalDialogIsOpen, setEditGoalDialogIsOpen ] = useState(false);
    const [ addCategoryDialogIsOpen, setAddCategoryDialogIsOpen ] = useState(false);
    
    const deleteCard = useDeleteCard();
    const deleteCategory = useDeleteCategory();
    const totalRewards = useGetTotalRewards(cardId || '')
    
    const card = useGetCard(cardId || '');
    const navigate = useNavigate();

    const handleDeleteCard = () => {
        if (cardId) {
            deleteCard(cardId);
            navigate('/')
        }
    }

    const handleDeleteCategory = (categoryId: string) => {
        if (cardId) {
            deleteCategory(cardId, categoryId)
        }
    }

    if (!card) {
        return <div>no card found</div>
    }

    return (
        <Box sx={{ padding: '4rem', marginBottom: '3rem' }}>
            <Breadcrumbs>
                <Link onClick={() => navigate('/')} sx={{ cursor: 'pointer' }} underline='hover'>CC Summary</Link>
                <Typography sx={{ color: 'orange' }}>TD Aeroplan Visa Infinite</Typography>
            </Breadcrumbs>

            <Box sx={{ margin: '1rem 0' }}>
                <Typography variant="h4">{ card.name }</Typography>
                <Typography sx={{ whiteSpace: 'break-spaces' }} gutterBottom>{ card.description }</Typography>
                <Box sx={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', marginTop: '1rem' }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography className="inline-date">Credit Card Open Date:{' '}</Typography>
                        <Typography className="inline-date-value">{card.openDate || 'none'}</Typography>
                        <br />
                        <Typography className="inline-date">Credit Card Close Date:{' '}</Typography>
                        <Typography className="inline-date-value">{card.closeDate || 'none'}</Typography>
                        <br />
                        <Typography className="inline-date">Cycle Start Date:{' '}</Typography>
                        <Typography className="inline-date-value">{card.cycleStartDay || 'none'}</Typography>
                        <br />
                        <Typography className="inline-date">Cycle End Date:{' '}</Typography>
                        <Typography className="inline-date-value">{card.cycleEndDay || 'none'}</Typography>
                        <br />

                        <EditCardDetailsDialog cardData={card} isOpen={editGoalDialogIsOpen} onClose={() => setEditGoalDialogIsOpen(false)} />
                        <Button color="secondary" onClick={() => setEditGoalDialogIsOpen(true)}>Edit</Button>
                    </Box>
                    <RequiredSpend cardId={cardId} />
                    <TotalRewards cardId={cardId} />
                    <TotalExpenditure cardId={cardId} />
                </Box>
                <Box sx={{ marginBottom: '1rem' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="h6">Goals</Typography>
                        <Button 
                            color="secondary" 
                            sx={{ marginLeft: '15px' }} 
                            onClick={() => setAddGoalDialogIsOpen(true)}
                        >
                            Add goal
                        </Button>
                    </Box>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {(card?.goals || []).map((goal) => (
                            <Goal key={goal.id} {...goal} cardId={cardId} />
                        ))}
                    </Box>
                    <AddGoalDialog isOpen={addGoalDialogIsOpen} onClose={() => setAddGoalDialogIsOpen(false)} />
                </Box>
                <Box>
                    <Box sx={{ display: 'flex' }}>
                        <Typography variant="h6" sx={{ margin: '0.5rem 0' }}>Categories</Typography>
                        <Button
                            color="secondary" 
                            onClick={() => setAddCategoryDialogIsOpen(true)} 
                            sx={{ marginTop: '0.5rem', marginLeft: '15px' }}
                        >
                            Add category
                        </Button>
                    </Box>
                    <Box>
                        {(card?.categories || []).map((category) => (
                            <Chip 
                                onDelete={() => handleDeleteCategory(category.id)} 
                                key={category.name} 
                                sx={{ marginRight: '5px', marginBottom: '5px' }} 
                                label={`${category.name}: ${category.rewardRatio} ${ card.type === 'CASHBACK' ? 'cashback per dollar' : 'points per dollar' }`} 
                            />
                        ))}
                    </Box>
                    <AddCategoryDialog isOpen={addCategoryDialogIsOpen} onClose={() => setAddCategoryDialogIsOpen(false)} />
                </Box>
                <Box>

                </Box>
                <Box sx={{ marginTop: '1rem' }}>
                    <AddTransaction />
                    <TransactionTable />
                </Box>
            </Box>

            <Button onClick={handleDeleteCard} color="error">Delete card</Button>

        </Box>
    )
}

export default Card