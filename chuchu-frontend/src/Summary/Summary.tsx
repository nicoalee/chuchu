import { Box, Breadcrumbs, Link, Typography, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import CardSummary from './CardSummary/CardSummary';
import React from 'react';
import { useGetCards } from '../CardStore';
import CreateCardComponent from './CreateCardDialog/CreateCardComponent';

const Summary = () => {
    const cards = useGetCards();

    return (
        <Box sx={{ padding: '2rem 4rem' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Breadcrumbs>
                    <Link sx={{ color: 'orange' }} underline='none'>
                        <Typography variant="h6">CC Summary</Typography>
                    </Link>
                </Breadcrumbs>
                <CreateCardComponent />
            </Box>
            <Box sx={{ marginTop: '1rem' }}>
                {(cards || []).filter(x => !x.closeDate).map((card) => (
                    <CardSummary key={card.id} {...card} />
                ))}
            </Box>
            <Box sx={{ margin: '1rem 0' }}>
                <Accordion elevation={4}>
                    <AccordionSummary>
                        <Typography>Closed Cards</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {(cards || []).filter(x => !!x.closeDate).map((card) => (
                            <CardSummary key={card.id} {...card} />
                        ))}
                    </AccordionDetails>
                </Accordion>
            </Box>
        </Box>
    )
}

export default Summary;