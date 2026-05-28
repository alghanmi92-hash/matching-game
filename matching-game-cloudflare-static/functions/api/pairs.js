export async function onRequestGet(context) {

  const { AIRTABLE_TOKEN, AIRTABLE_BASE_ID } = context.env;

  const url = new URL(context.request.url);

  const gameKey = url.searchParams.get('gameKey');

  const limit =
    Number(url.searchParams.get('limit') || 20);

  if (!gameKey) {

    return Response.json(
      { error: 'gameKey مطلوب' },
      { status: 400 }
    );

  }

  const formula =
    encodeURIComponent(
      `AND({game_key}='${gameKey}', {active}=1)`
    );

  const apiUrl =
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/game_pairs?filterByFormula=${formula}`;

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`
    }
  });

  const data = await response.json();

  let pairs =
    (data.records || []).map(record => ({
      pairId: String(record.fields.pair_id),
      a: record.fields.card_a,
      b: record.fields.card_b
    }));

  pairs =
    shuffle(pairs).slice(0, limit);

  return Response.json(pairs);

}

function shuffle(array) {

  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {

    const j =
      Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] =
      [arr[j], arr[i]];

  }

  return arr;

}