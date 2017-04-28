import mobile from '../../src/js/Services/mobile';

describe('mobile service', () => {

   beforeEach(() => {
      Object.defineProperty(document.body, 'offsetWidth', { get: () => 1000, configurable: true });

      if ('ontouchstart' in window) {
         delete window.ontouchstart;
      }

      Object.defineProperty(window.navigator, 'userAgent', { get: () => 'Hrome', configurable: true })
   });

   it('detects desktop mode', () => {
      expect(mobile() === false);

      Object.defineProperty(document.body, 'offsetWidth', { get: () => 500, configurable: true });

      expect(mobile() === false);

      window.ontouchstart = true;

      expect(mobile() === false);
   });

   it('detects mobile mode', () => {
      expect(mobile() === false);

      Object.defineProperty(document.body, 'offsetWidth', { get: () => 500, configurable: true });
      window.ontouchstart = true;
      Object.defineProperty(window.navigator, 'userAgent', { get: () => 'iPhone', configurable: true })

      expect(mobile() === true);
   });

});
