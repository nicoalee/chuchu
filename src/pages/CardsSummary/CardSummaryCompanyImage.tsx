import { useMemo } from "react"
import { COMPANIES } from "../../constants"
import { Card, Image } from "@mantine/core";

function CardSummaryCompanyImage({ accountName, cardUrl }: { accountName: string, cardUrl?: string }) {
    const company = useMemo(() => {
        return COMPANIES.find((company) => accountName.toLocaleLowerCase().replace(/\s/g,'')
            .includes(company.id.toLocaleLowerCase()))
    }, [accountName])

    return (
        <Card.Section>
            <Image style={{ height: '157px', borderRadius: '8px' }} width="100%" src={cardUrl || company?.imageURL} />
        </Card.Section>
    )
}

export default CardSummaryCompanyImage