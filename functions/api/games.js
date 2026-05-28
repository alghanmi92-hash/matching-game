export async function onRequestGet(context) {

  const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID } = context.env;

  const url =
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/games?filterByFormula={active}=1`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`
    }
  });

  const data = await response.json();

  const games =
    (data.records || []).map(record => ({
      key: record.fields.game_key,
      title: record.fields.title,
      description: record.fields.description || '',
      icon: record.fields.icon || '🎮'
    }));

  return Response.json(games);

}