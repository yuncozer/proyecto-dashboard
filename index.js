const path = require('path');
const express = require('express');
const hubspot = require('@hubspot/api-client')
// import path from 'path';
// import express from 'express';
// import hubspot from "@hubspot/api-client";


const PORT = process.env.PORT || 5000;
const App = express();
const hubspotClient = new hubspot.Client({ "accessToken": "pat-na1-7c30a5aa-76c7-4ca4-99ea-9256ab0dae07" });

App.use(express.static(path.join(__dirname, '/public')));

const props = async () => {

    const objectType = "meeting";
    const archived = false;
    try {
        const apiResponse = await hubspotClient.crm.properties.coreApi.getAll(objectType, archived);
        const data = apiResponse.results;
        const props = data.map(p => ({
            name: p.name,
            format: p.type,
            desc: p.description
        }));
        return (props);
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }
}

App.get('/apiprops', async (req, res) => {
    const dataProperties = await props();
    res.json(dataProperties)
});


/////////////////////////////////////// CONTACTS //////////////////////////////////////////////////////////
const contacts = async () => {

    const limit = 100;
    const after = undefined;
    const properties = ["firstname, lastname, createdate, lastmodifieddate, email, phone, lifecyclestage, hs_time_in_customer, hs_time_in_lead, hubspot_owner_assigneddate, hs_is_unworked, ownername, owneremail, hs_date_entered_customer, hs_date_entered_evangelist, hs_date_entered_marketingqualifiedlead, hs_date_entered_opportunity, hs_date_entered_other, hs_date_entered_salesqualifiedlead, hs_date_entered_lead, hs_date_entered_subscriber"];
    const propertiesWithHistory = undefined;
    const associations = undefined;
    const archived = false;
    try {
        const apiResponse = await hubspotClient.crm.contacts.basicApi.getPage(limit, after, properties, propertiesWithHistory, associations, archived);
        const data = apiResponse.results;
        const contact = data.map(p => ({
            id: p.id,
            name: p.properties.firstname,
            lastname: p.properties.lastname,
            createDate: p.properties.createdate,
            dateLastModify: p.properties.lastmodifieddate,
            email: p.properties.email,
            phone: p.properties.phone,
            status: p.properties.lifecyclestage,
            timeCustomer: p.properties.hs_time_in_customer,
            timeLead: p.properties.hs_time_in_lead,
            dateOwnerAssigned: p.properties.hubspot_owner_assigneddate,
            isUnworked: p.properties.hs_is_unworked,
            dateCustomer: p.properties.hs_date_entered_customer,
            dateEvangelist: p.properties.hs_date_entered_evangelist,
            dateMarketingQualifiedLead: p.properties.hs_date_entered_marketingqualifiedlead,
            dateOpportunity: p.properties.hs_date_entered_opportunity,
            dateSalesQualifiedLead: p.properties.hs_date_entered_salesqualifiedlead,
            dateLead: p.properties.hs_date_entered_lead,
            dateSubscriber: p.properties.hs_date_entered_subscriber,
            dateOther: p.properties.hs_date_entered_other
        }));
        return (contact);
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }
}

App.get('/apicontacts/', async (req, res) => {
    const dataContacts = await contacts();
    res.json(dataContacts);
});


//////////////////////////////////////////// Companies /////////////////////////////////////////////////////
App.get('/apicompanies', async (req, res) => {

    const limit = 100;
    const after = undefined;
    const properties = ["name, domain, createdate, hs_lastmodifieddate, country, lifecyclestage, type, hubspot_owner_id, hubspot_owner_assigneddate"];
    const propertiesWithHistory = undefined;
    const associations = undefined;
    const archived = false;
    try {
        const apiResponse = await hubspotClient.crm.companies.basicApi.getPage(limit, after, properties, propertiesWithHistory, associations, archived);
        const data = apiResponse.results;
        console.log(data);
        const companie = data.map(p => ({
            id: p.id,
            name: p.properties.name,
            domain: p.properties.domain,
            createDate: p.properties.createdate,
            dateLastModify: p.properties.hs_lastmodifieddate,
            country: p.properties.country,
            lifeCycleStage: p.properties.lifecyclestage,
            type: p.properties.type,
            ownerId: p.properties.hubspot_owner_id,
            ownerAssignedDate: p.properties.hubspot_owner_assigneddate
        }));
        res.json(companie);
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }
});

//////////////////////////////////////////// Owners /////////////////////////////////////////////////////
const owners = async () => {

    const email = undefined;
    const after = undefined;
    const limit = 100;
    const archived = false;

    try {
        const apiResponse = await hubspotClient.crm.owners.ownersApi.getPage(email, after, limit, archived);
        const data = apiResponse.results;
        const owner = data.map(p => ({
            id: p.id,
            email: p.email,
            name: p.firstName + " " + p.lastName,
            createDate: p.createdAt,
            updateDate: p.updatedAt,
            userId: p.userId
        }));
        return (owner);
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }
}

App.get('/apiowners', async (req, res) => {
    const dataOwners = await owners();
    res.json(dataOwners);
});
////////////////////////////////////////////// Mails //////////////////////////////////////////////////////////////

const mails = async () => {
    const limit = 100;
    const after = undefined;
    const properties = ["hubspot_owner_id"];
    const propertiesWithHistory = undefined;
    const associations = undefined;
    const archived = false;

    try {
        const apiResponse = await hubspotClient.crm.objects.emails.basicApi.getPage(limit, after, properties, propertiesWithHistory, associations, archived);
        const data = apiResponse.results;
        const mails = data.map(p => ({
            id: p.id,
            createDate: p.createdAt,
            updateDate: p.updatedAt,
            ownerId: p.properties.hubspot_owner_id
        }));
        return (mails)
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }

}

App.get('/apiemails', async (req, res) => {
    const dataEmails = await mails();
    res.json(dataEmails);
});
////////////////////////////////////////////// Calls //////////////////////////////////////////////////////////////

const calls = async () => {
    const limit = 100;
    const after = undefined;
    const properties = ["hubspot_owner_id"];
    const propertiesWithHistory = undefined;
    const associations = undefined;
    const archived = false;

    try {
        const apiResponse = await hubspotClient.crm.objects.calls.basicApi.getPage(limit, after, properties, propertiesWithHistory, associations, archived);
        const data = apiResponse.results;
        const calls = data.map(p => ({
            id: p.id,
            createDate: p.createdAt,
            updateDate: p.updatedAt,
            ownerId: p.properties.hubspot_owner_id
        }));
        return (calls)
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }

}
App.get('/apicalls', async (req, res) => {
    const dataCalls = await calls();
    res.json(dataCalls);
});

////////////////////////////////////////////// Meetings //////////////////////////////////////////////////////////////

const meetings = async () => {
    const limit = 100;
    const after = undefined;
    const properties = ["hubspot_owner_id"];
    const propertiesWithHistory = undefined;
    const associations = undefined;
    const archived = false;

    try {
        const apiResponse = await hubspotClient.crm.objects.meetings.basicApi.getPage(limit, after, properties, propertiesWithHistory, associations, archived);
        const data = apiResponse.results;
        const meetings = data.map(p => ({
            id: p.id,
            createDate: p.createdAt,
            updateDate: p.updatedAt,
            ownerId: p.properties.hubspot_owner_id,
        }));
        return (meetings)
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }

}
App.get('/apimeetings', async (req, res) => {
    const dataMeetings = await meetings();
    res.json(dataMeetings);
});
///////////////////////////////////////////// Deals ////////////////////////////////////////////////////////////


const deals = async () => {
    const limit = 100;
    const after = undefined;
    const properties = ["dealname, dealstage, amount, createdate, hs_lastmodifieddate, closedate, hubspot_owner_id, hubspot_owner_assigneddate, notes_last_contacted,hs_updated_by_user_id, hs_created_by_user_id, hs_next_step, hs_is_closed, hs_forecast_amount, hs_projected_amount, amount, hs_deal_stage_probability, dealtype, num_contacted_notes"];
    const propertiesWithHistory = undefined;
    const associations = undefined;
    const archived = false;
    try {
        const apiResponse = await hubspotClient.crm.deals.basicApi.getPage(limit, after, properties, propertiesWithHistory, associations, archived);
        const data = apiResponse.results;
        const deal = data.map(p => ({
            id: p.id,
            name: p.properties.dealname,
            stage: p.properties.dealstage,
            amount: p.properties.amount,
            createDate: p.properties.createdate,
            dateLastModify: p.properties.hs_lastmodifieddate,
            closeDate: p.properties.closedate,
            idOwner: p.properties.hubspot_owner_id,
            dateAssigneLastOwner: p.properties.hubspot_owner_assigneddate,
            lastCallMailMeeting: p.properties.notes_last_contacted,
            hs_updated_by_user_id: p.properties.hs_updated_by_user_id,
            hs_created_by_user_id: p.properties.hs_created_by_user_id,
            nextStep: p.properties.hs_next_step,
            isClosed: p.properties.hs_is_closed,
            predictedAmount: p.properties.hs_projected_amount,
            dealStageProbability: p.properties.hs_deal_stage_probability,
            dealType: p.properties.dealtype,
            numContacted: p.properties.num_contacted_notes
        }));
        return (deal)
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }
}

App.get('/apideals', async (req, res) => {
    const dataDeals = await deals();
    const dataOwners = await owners();
    res.json(dataDeals);

});

//////////////////////////////////////////////////Associations Deals with Engagements ///////////////////////////

const asoc = async (dealId, toObjectType) => {
    const after = undefined;
    const limit = 100;
    try {
        const apiResponse = await hubspotClient.crm.deals.associationsApi.getAll(dealId, toObjectType, after, limit);
        const data = apiResponse.results;
        let asocObject = data.map(p => ({ idActivity: p.toObjectId }));
        return (asocObject);
    } catch (e) {
        e.message === 'HTTP request failed'
            ? console.error(JSON.stringify(e.response, null, 2))
            : console.error(e)
    }
};


////////////////////////////////////Asoc dynamic ///////////////////////////////////////////////////////////////7

App.get('/apiaccountmanagers', async (req, res) => {


    const dataOwners = await owners();
    const dataMails = await mails();
    const dataCalls = await calls();
    const dataDeals = await deals();
    const dataMeetings = await meetings();

    const arrayAsoc = await Promise.all(dataDeals.map(async (element) => {
        let dealId = element.id;
        let emails = await asoc(dealId, "email");
        let calls = await asoc(dealId, "call");
        let meetings = await asoc(dealId, "meeting");
        let arr = { emails, calls, meetings, dealId };

        return (arr);
    }))

    /////////  Filtrando dataDeals por ultima actividad (mails and calls) en ultimas 24 horas  
    const weekAgo = new Date().getTime() - 604800000;
    let dataRecentActivityMails = [];
    let dataRecentActivityCalls = [];
    let dataRecentActivityMeetings = [];
    dataDeals.filter(el => Date.parse(el.lastCallMailMeeting) > weekAgo).map(elDeal => {
        arrayAsoc.map(elAsoc => {
            if (elAsoc.dealId === elDeal.id) {
                elAsoc.emails.map(elMailAsco => {
                    dataMails.filter(el => Date.parse(el.createDate) > weekAgo).map((elMail, index) => {
                        if (elMail.id == elMailAsco.idActivity) {
                            // console.log(elMail.id, "===", elMailAsco.idActivity, "i: ",index );
                            dataOwners.map(elOwner => {
                                if (elOwner.id == elMail.ownerId) {
                                    dataRecentActivityMails[index] = {
                                        idDeal: elAsoc.dealId,
                                        nameDeal: elDeal.name,
                                        idOwnerDeal: elDeal.idOwner,
                                        typeActivity: "Email",
                                        idActivity: `${elMailAsco.idActivity}`,
                                        createDate: elMail.createDate.toLocaleString("en-US"),
                                        idOwnerActivity: elMail.ownerId,
                                        ownerActivityName: elOwner.name,
                                        isClosedDeal: elDeal.isClosed
                                    };
                                } // if data owners
                            }) // map data owners    
                        } // if mails
                    }) // map filterDataMails
                }) // map elAsoc.emails
                elAsoc.calls.map(elCallAsoc => {
                    dataCalls.filter(el => Date.parse(el.createDate) > weekAgo).map((elCall, index) => {
                        if (elCall.id == elCallAsoc.idActivity) {
                            // console.log(elCall.id, "===", elCallAsoc.idActivity, "i: ",index );
                            dataOwners.map(elOwner => {
                                if (elOwner.id == elCall.ownerId) {
                                    dataRecentActivityCalls[index] = {
                                        idDeal: elAsoc.dealId,
                                        nameDeal: elDeal.name,
                                        idOwnerDeal: elDeal.idOwner,
                                        typeActivity: "Call",
                                        idActivity: `${elCallAsoc.idActivity}`,
                                        createDate: elCall.createDate.toLocaleString("en-US"),
                                        idOwnerActivity: elCall.ownerId,
                                        ownerActivityName: elOwner.name,
                                        isClosedDeal: elDeal.isClosed
                                    };
                                } // if data owners
                            }) // map data owners   
                        }
                    }) // map filterDataCalls
                }) // map elAsoc.call
                elAsoc.meetings.map(elMeetingAsoc => {
                    dataMeetings.filter(el => Date.parse(el.createDate) > weekAgo).map((elMeeting, index) => {
                        if (elMeeting.id == elMeetingAsoc.idActivity) {
                            // console.log(elMeeting.id, "===", elMeetingAsoc.idActivity, "i: ",index );
                            dataOwners.map(elOwner => {
                                if (elOwner.id == elMeeting.ownerId) {
                                    dataRecentActivityMeetings[index] = {
                                        idDeal: elAsoc.dealId,
                                        nameDeal: elDeal.name,
                                        idOwnerDeal: elDeal.idOwner,
                                        typeActivity: "Meeting",
                                        idActivity: `${elMeetingAsoc.idActivity}`,
                                        createDate: elMeeting.createDate.toLocaleString("en-US"),
                                        idOwnerActivity: elMeeting.ownerId,
                                        ownerActivityName: elOwner.name,
                                        isClosedDeal: elDeal.isClosed
                                    };
                                } // if data owners
                            }) // map data owners   
                        }
                    }) // map filterDataCalls
                }) // map elAsoc.call
            } // if
        }) // map arrayAsoc          

    }) // map filterDataMails
    let dataRecentActivity = [].concat(dataRecentActivityMails, dataRecentActivityCalls, dataRecentActivityMeetings);
    res.json(dataRecentActivity);

});


// const __dirname = path.resolve();
// App.use(express.static(path.join(__dirname, 'build')));


// All other GET requests not handled before will return our React app

App.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
});

App.listen(PORT, () => {console.log(`Server listening on ${PORT}`);});