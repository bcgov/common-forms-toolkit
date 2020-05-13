import router from '@/router';

describe('Router', () => {
  const routes = router.options.routes;

  it('has the correct number of routes', () => {
    expect(routes).toHaveLength(4);
  });

  it('has the expected routes', () => {
    const routeSet = new Set(routes);
    expect(routeSet).toContainEqual(expect.objectContaining({ name: 'Home' }));
    expect(routeSet).toContainEqual(expect.objectContaining({ name: 'NotFound' }));
  });
});
