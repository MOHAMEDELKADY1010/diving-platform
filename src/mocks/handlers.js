import { rest } from 'msw';

const baseURL = 'https://pp5api-divingspace-f0baea7c564e.herokuapp.com/';

export const handlers = [
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        pk: 6,
        username: 'Ben',
        email: '',
        first_name: '',
        last_name: '',
        profile_id: 6,
        profile_image:
          'https://res.cloudinary.com/duk6bc8tg/image/upload/v1719329423/default_profile_ameb12.jpg',
      })
    );
  }),
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
