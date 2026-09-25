// @vitest-environment jsdom

import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GuideMap } from "./guide-map";
import { spotsOnFloor } from "../domain/spots";

const floor1 = spotsOnFloor(1);
const floor2 = spotsOnFloor(2);
const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });

beforeEach(() => {
  fetchMock.mockClear();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("地図", () => {
  it("初期は1階で、2階へ切り替えると印が入れ替わる", async () => {
    const user = userEvent.setup();
    render(<GuideMap floor1={floor1} floor2={floor2} />);

    expect(screen.getByText("1階", { selector: "p" })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /^(?!1階$|2階$).+/ })).toHaveLength(11);

    await user.click(screen.getByRole("button", { name: "2階" }));

    expect(screen.getByText("2階", { selector: "p" })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /^(?!1階$|2階$).+/ })).toHaveLength(9);
    expect(floor1.length + floor2.length).toBe(20);
  });

  it("印は枠の中に中心を置く", () => {
    render(<GuideMap floor1={floor1} floor2={floor2} />);
    const pins = screen.getAllByRole("button", { name: /^(?!1階$|2階$).+/ });
    for (const pin of pins) {
      const left = Number.parseFloat(pin.style.left);
      const top = Number.parseFloat(pin.style.top);
      expect(left).toBeGreaterThan(0);
      expect(left).toBeLessThan(100);
      expect(top).toBeGreaterThan(0);
      expect(top).toBeLessThan(100);
      expect(pin.style.transform || getComputedStyle(pin).transform).toBeTruthy();
    }
  });
});

describe("説明", () => {
  const literary = floor1.find((spot) => spot.name.startsWith("文芸書"));
  const bunko = floor1.find((spot) => spot.name.startsWith("文庫"));

  it("タップで名前・分類・説明が開き、ホバーでは開かない", async () => {
    const user = userEvent.setup();
    render(<GuideMap floor1={floor1} floor2={floor2} />);

    await user.hover(screen.getByRole("button", { name: literary!.name }));
    expect(screen.queryByText(literary!.desc)).toBeNull();

    await user.click(screen.getByRole("button", { name: literary!.name }));
    const sheet = screen.getByRole("complementary");
    expect(within(sheet).getByText(literary!.name)).toBeTruthy();
    expect(within(sheet).getByText(literary!.category)).toBeTruthy();
    expect(within(sheet).getByText(literary!.desc)).toBeTruthy();
    expect(screen.queryByText(/平均滞在|stay_min/)).toBeNull();

    await user.click(screen.getByRole("button", { name: bunko!.name }));
    expect(screen.getByText(bunko!.desc)).toBeTruthy();
    expect(screen.queryByText(literary!.desc)).toBeNull();

    await user.click(screen.getByRole("button", { name: "閉じる" }));
    expect(screen.queryByText(bunko!.desc)).toBeNull();
  });

  it("対象スポットの開き直しだけ回数APIへspotIdを渡す", async () => {
    const user = userEvent.setup();
    const entrance = floor1.find((spot) => spot.id === 1);
    render(<GuideMap floor1={floor1} floor2={floor2} />);

    await user.click(screen.getByRole("button", { name: literary!.name }));
    await user.click(screen.getByRole("button", { name: literary!.name }));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body))).toEqual({
      spotId: literary!.id,
    });

    await user.click(screen.getByRole("button", { name: "閉じる" }));
    await user.click(screen.getByRole("button", { name: literary!.name }));
    expect(fetchMock).toHaveBeenCalledTimes(2);

    await user.click(screen.getByRole("button", { name: entrance!.name }));
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
