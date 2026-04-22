export function paginate(query: { page?: any; limit?: any }) {
      let page = Number(query.page);
      let limit = Number(query.limit);

      if (!Number.isFinite(page) || page < 1) page = 1;
      if (!Number.isFinite(limit) || limit < 1) limit = 20;

      return {
            skip: (page - 1) * limit,
            take: limit,
            page,
            limit,
      };
}