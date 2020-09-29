const BASE_URL = "http://dev.gia.fpx.se/api/v1";

export default {
  async validateResponse(response) {
    if (!response.ok) throw new Error(await response.text());
  },
  async getByName(collectionName) {
    console.debug('getByName');
    const headers = {
      Accept: `application/json`,
    };

    if (session.authenticated()) headers.Authorization = `Bearer ${session.token}`;

    const response = await fetch(`${BASE_URL}/collections/by_name/${collectionName}`, {
      headers,
    });

    await this.validateResponse(response);

    const data = await response.json();
    return data;
  },
  async fetchItems(signal, collectionId, bounds, simplify) {
    console.debug('fetchItems');
    const headers = {
      Accept: `application/geojson`,
    };

    if (session.authenticated()) headers.Authorization = `Bearer ${session.token}`;

    const response = await fetch(
      `${BASE_URL}/collections/${collectionId}/items?limit=100000&spatial_filter=intersect&spatial_filter.envelope.xmin=${bounds.minX}&spatial_filter.envelope.ymin=${bounds.minY}&spatial_filter.envelope.xmax=${bounds.maxX}&spatial_filter.envelope.ymax=${bounds.maxY}&simplify=${simplify}`,
      {
        headers,
        signal,
      }
    );

    await this.validateResponse(response);

    const data = await response.json();
    console.debug('items fetched');
    return data;
  },
  async addItem(collectionId, item) {
    const response = await fetch(`${BASE_URL}/collections/${collectionId}/items`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': `application/json`,
      },
      body: JSON.stringify(item)
    });

    await this.validateResponse(response);
  },
  async removeItems(items) {
    // eslint-disable-next-line no-restricted-syntax
    for (const item of items) {
      // TODO: Fix
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(`${BASE_URL}/items/${item.id}`, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
      });

      // TODO: Fix
      // eslint-disable-next-line no-await-in-loop
      await this.validateResponse(response);
    }
  },
  async updateItems(items) {
    const response = await fetch(`${BASE_URL}/items`, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': `application/geojson`,
        Accept: 'application/geojson',
      },
      body: JSON.stringify({
        type: 'FeatureCollection',
        features: items,
      }),
    });

    await this.validateResponse(response);
  },
  async create(collectionName, isPublic) {
    const response = await fetch(`${BASE_URL}/collections`, {
      method: 'POST',
      mode: 'cors',
      headers: {
        Authorization: `Bearer ${session.token}`,
        'Content-Type': `application/json`,
      },
      body: JSON.stringify({
        name: collectionName,
        is_public: isPublic,
      }),
    });

    await this.validateResponse(response);

    const collection = await response.json();
    return collection;
  }
};
