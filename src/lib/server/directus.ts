import { createDirectus, rest, authentication, readItems } from '@directus/sdk';
import { DIRECTUS_URL, DIRECTUS_STATIC_TOKEN } from '$env/static/private';

export const directus = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(authentication());

if (DIRECTUS_STATIC_TOKEN) {
    directus.setToken(DIRECTUS_STATIC_TOKEN);
}

export const getAllCalendars = async () => {
    try {
        const calendar_response = await directus.request(readItems('calendars', {
            fields: ['name', 'tiers.tiers_id.id', 'tiers.tiers_id.name', 'tiers.tiers_id.time', 'tiers.tiers_id.comm_confirm', 'rounds'],
            filter: {
                'count(tiers)': { '_gt': 0 }
            },
            sort: '-name',
            limit: -1,
        }));

        if (!calendar_response.length) {
            console.log('No calendars found.');
            return [];
        }

        return calendar_response;
    } catch (error) {
        console.error('Error fetching calendars:', error);
        throw error;
    }
};

export const getAllTiers = async () => {
    try {
        const tiers_response = await directus.request(readItems('tiers', {
            fields: ['id', 'name', 'sort', 'time', 'platform', 'comm_confirm'],
            filter: {
                '_and': [
                    { 'league': { '_nnull': true } },
                    { '_or': [
                        { archived: { _eq: false } },
                        { archived: { _null: true } },
                    ]}
                ]
            },
            sort: ['sort'],
            limit: -1,
        }));

        if (!tiers_response.length) {
            console.log('No tiers found.');
            return [];
        }

        return tiers_response;
    } catch (error) {
        console.error('Error fetching tiers:', error);
        throw error;
    }
};
