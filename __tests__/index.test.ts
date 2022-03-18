import { JSDOM } from "jsdom";
import { streakCounter } from "../src/index";
import { formattedDate } from "../src/lib";

describe("streakCounter", () => {
  let mockLocalStorage: Storage;
  beforeEach(() => {
    const mockJSDom = new JSDOM("", { url: "https://localhost" });
    mockLocalStorage = mockJSDom.window.localStorage;
  });
  afterEach(() => {
    mockLocalStorage.clear();
  });

  it("should return a streak object with currentCount, starteDate and lastLoginDate", () => {
    const date = new Date();
    const streak = streakCounter(mockLocalStorage, date);
    expect(Object.prototype.hasOwnProperty.call(streak, "currentCount")).toBe(
      true
    );
    expect(Object.prototype.hasOwnProperty.call(streak, "startDate")).toBe(
      true
    );
    expect(Object.prototype.hasOwnProperty.call(streak, "lastLoginDate")).toBe(
      true
    );
  });
  it("should return a streak starting at 1 and keep track of lastLoginDate", () => {
    const date = new Date();
    const streak = streakCounter(mockLocalStorage, date);

    const dateFormatted = formattedDate(date);

    expect(streak.currentCount).toBe(1);
    expect(streak.lastLoginDate).toBe(dateFormatted);
  });
  it("should store the streak in localStorage", () => {
    const date = new Date();
    const key = "streak";
    streakCounter(mockLocalStorage, date);
    const streakAsString = mockLocalStorage.getItem(key);
    expect(streakAsString).not.toBeNull();
  });
  describe('with a prepopulated streak', () => {
    let mockLocalStorage: Storage
    beforeEach(() => {
      const mockJSDom = new JSDOM('', {url: 'https://localhost'})

      mockLocalStorage = mockJSDom.window.localStorage

      const date = new Date('2021-12-12')

      const streak = {
        currentCount: 1,
        startDate: formattedDate(date),
        lastLoginDate: formattedDate(date),
      }
      mockLocalStorage.setItem('streak', JSON.stringify(streak))
    })
    afterEach(() => {
      mockLocalStorage.clear()
    })
    it('should return the streak from localStorage', () => {
      const date = new Date()
      const streak = streakCounter(mockLocalStorage, date)
      expect (streak.startDate).toBe('12/12/2021')
    })
    it('should increment the streak', () => {
      const date = new Date('12/13/2021')
      const streak = streakCounter(mockLocalStorage, date)
      expect(streak.currentCount).toBe(2)
    })
    it('should not increment the streak when login days streaks are not consecutive/are broken', () => {
      const date = new Date()
      const streak = streakCounter(mockLocalStorage, date)
      expect(streak.currentCount).toBe(1)
    })
    it('should save the incremented streak to localStorage', () => {
      const key = 'streak'
      const date = new Date('12/13/2021')
      // Call it once so it updates the streak
      streakCounter(mockLocalStorage, date)
    
      const streakAsString = mockLocalStorage.getItem(key)
      // Normally you should wrap in try/catch in case the JSON is bad
      // but since we authored it, we can skip here
      const streak = JSON.parse(streakAsString || '')
    
      expect(streak.currentCount).toBe(2)
    })
  })
});