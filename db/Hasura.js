/*
This is an example snippet - you should consider tailoring it
to your service.
*/

export async function updateStats(
  token,
  { favourited, userId, videoId, watched = true }
) {
  const operationsDoc = `
  mutation updateStats($userId: String, $videoId: String, $favourited: Int, $watched: Boolean) {
    update_stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}, _set: {favourited: $favourited, watched: $watched})
    {
      returning {
        favourited
        id
        watched
        videoId
        userId
      }
      affected_rows
    }
  }
`;
  const response = await fetchGraphQL(
    operationsDoc,
    "updateStats",
    {
      favourited,
      userId,
      videoId,
      watched,
    },
    token
  );
  return response;
}

export async function insertNewStats(
  userId,
  videoId,
  token,
  favourited = 0,
  watched = true
) {
  const operationsDoc = `
  mutation insertStats($favourited: Int, $userId: String, $videoId: String, $watched: Boolean) {
    insert_stats_one(object: {favourited: $favourited, userId: $userId, videoId: $videoId, watched: $watched}) {
      favourited
      id
      userId
      videoId
      watched
    }
  }
`;
  const response = await fetchGraphQL(
    operationsDoc,
    "insertStats",
    {
      favourited,
      userId,
      videoId,
      watched,
    },
    token
  );
  return response;
}

export default async function findVideoIdByUser(userId, videoId, token) {
  const operationsDoc = `query findVideoIdByUserId($videoId: String, $userId: String) {
    stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
      userId
      videoId
      watched
      favourited
    }
  }`;
  const response = await fetchGraphQL(
    operationsDoc,
    "findVideoIdByUserId",
    {
      videoId,
      userId,
    },
    token
  );
  return response.data;
}

export async function createNewUser(token, metaData) {
  const operationsDoc = `
  mutation createNewUser($email: String, $issuer: String, $publicAddress: String) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      affected_rows
      returning {
        email
        id
        issuer
      }
    }
  }
`;
  const response = await fetchGraphQL(
    operationsDoc,
    "createNewUser",
    {
      email: metaData.email,
      issuer: metaData.issuer,
      publicAddress: metaData.publicAddress,
    },
    token
  );
  // return response?.users?.length === 0;
}

export async function isNewUser(token, issuer) {
  const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      email
      id
      issuer
      publicAddress
    }
  }
`;
  const response = await fetchGraphQL(
    operationsDoc,
    "isNewUser",
    { issuer },
    token
  );
  return response?.data?.users?.length === 0;
}

async function fetchGraphQL(operationsDoc, operationName, variables, token) {
  const result = await fetch(process.env.NEXT_PUBLIC_HASURA_ADMIN_URL, {
    method: "POST",
    headers: {
      "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

export async function getWatchedVideos(userId, token) {
  const operationsDoc = `
  query fetchWatchedVideos($userId: String) {
    stats(where: {watched: {_eq: true}, userId: {_eq: $userId}}) {
      watched
      videoId
    }
  }
`;
  const response = await fetchGraphQL(
    operationsDoc,
    "fetchWatchedVideos",
    {
      userId,
    },
    token
  );
  return response.data.stats;
}

export async function fetchMylist(userId, token) {
  const operationsDoc = `
  query fetchList($userId: String) {
    stats(where: {favourited: {_eq: 1}, userId: {_eq: $userId}}) {
      videoId
    }
  }
`;
  const response = await fetchGraphQL(
    operationsDoc,
    "fetchList",
    {
      userId,
    },
    token
  );
  return response.data.stats;
}
