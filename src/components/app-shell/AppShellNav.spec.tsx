import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AppShellNavView } from "./AppShellNav";
import { APP_SHELL_COPY } from "./copy";

afterEach(cleanup);

describe("AppShellNavView — desktop top nav", () => {
  it("renders the Ledgerly wordmark", () => {
    render(<AppShellNavView pathname="/reconcile">content</AppShellNavView>);
    expect(screen.getAllByText(APP_SHELL_COPY.brand).length).toBeGreaterThan(0);
  });

  it("renders a Reconcile link pointing to /reconcile", () => {
    render(<AppShellNavView pathname="/ledgers">content</AppShellNavView>);
    const link = screen
      .getAllByRole("link", { name: APP_SHELL_COPY.linkReconcile })
      .find((el) => el.getAttribute("href") === "/reconcile");
    expect(link).toBeDefined();
  });

  it("renders a Ledgers link pointing to /ledgers", () => {
    render(<AppShellNavView pathname="/reconcile">content</AppShellNavView>);
    const link = screen
      .getAllByRole("link", { name: APP_SHELL_COPY.linkLedgers })
      .find((el) => el.getAttribute("href") === "/ledgers");
    expect(link).toBeDefined();
  });

  it("renders a Goals link pointing to /goals", () => {
    render(<AppShellNavView pathname="/reconcile">content</AppShellNavView>);
    const link = screen
      .getAllByRole("link", { name: APP_SHELL_COPY.linkGoals })
      .find((el) => el.getAttribute("href") === "/goals");
    expect(link).toBeDefined();
  });

  it("renders an Investments link pointing to /investments", () => {
    render(<AppShellNavView pathname="/reconcile">content</AppShellNavView>);
    const link = screen
      .getAllByRole("link", { name: APP_SHELL_COPY.linkInvestments })
      .find((el) => el.getAttribute("href") === "/investments");
    expect(link).toBeDefined();
  });

  it("renders an Annuities link pointing to /annuities", () => {
    render(<AppShellNavView pathname="/reconcile">content</AppShellNavView>);
    const link = screen
      .getAllByRole("link", { name: APP_SHELL_COPY.linkAnnuities })
      .find((el) => el.getAttribute("href") === "/annuities");
    expect(link).toBeDefined();
  });

  it("renders an Accounts link pointing to /accounts", () => {
    render(<AppShellNavView pathname="/reconcile">content</AppShellNavView>);
    const link = screen
      .getAllByRole("link", { name: APP_SHELL_COPY.linkAccounts })
      .find((el) => el.getAttribute("href") === "/accounts");
    expect(link).toBeDefined();
  });

  it("renders a Profile link pointing to /profile", () => {
    render(<AppShellNavView pathname="/reconcile">content</AppShellNavView>);
    const link = screen
      .getAllByRole("link", { name: APP_SHELL_COPY.linkProfile })
      .find((el) => el.getAttribute("href") === "/profile");
    expect(link).toBeDefined();
  });
});

describe("AppShellNavView — active-route styling", () => {
  it("marks the Ledgers desktop link as active when pathname is /ledgers", () => {
    render(<AppShellNavView pathname="/ledgers">content</AppShellNavView>);
    const ledgersLinks = screen
      .getAllByRole("link", { name: APP_SHELL_COPY.linkLedgers })
      .filter((el) => el.getAttribute("href") === "/ledgers");
    const active = ledgersLinks.find(
      (el) => el.getAttribute("aria-current") === "page",
    );
    expect(active).toBeDefined();
  });

  it("marks the Ledgers desktop link as active for nested paths like /ledgers/abc123", () => {
    render(
      <AppShellNavView pathname="/ledgers/abc123">content</AppShellNavView>,
    );
    const ledgersLinks = screen
      .getAllByRole("link", { name: APP_SHELL_COPY.linkLedgers })
      .filter((el) => el.getAttribute("href") === "/ledgers");
    const active = ledgersLinks.find(
      (el) => el.getAttribute("aria-current") === "page",
    );
    expect(active).toBeDefined();
  });

  it("does not mark the Reconcile link as active when pathname is /ledgers", () => {
    render(<AppShellNavView pathname="/ledgers">content</AppShellNavView>);
    const reconcile = screen
      .getAllByRole("link", { name: APP_SHELL_COPY.linkReconcile })
      .find((el) => el.getAttribute("href") === "/reconcile");
    expect(reconcile?.getAttribute("aria-current")).not.toBe("page");
  });
});

describe("AppShellNavView — mobile bottom tab bar", () => {
  it("renders the mobile nav with the correct aria-label from copy", () => {
    render(<AppShellNavView pathname="/reconcile">content</AppShellNavView>);
    const nav = screen.getByRole("navigation", {
      name: APP_SHELL_COPY.mobileNavLabel,
    });
    expect(nav).toBeDefined();
  });

  it("renders a mobile Reconcile tab link pointing to /reconcile", () => {
    render(<AppShellNavView pathname="/ledgers">content</AppShellNavView>);
    const tabs = screen
      .getAllByRole("link", { name: APP_SHELL_COPY.linkReconcile })
      .filter((el) => el.getAttribute("href") === "/reconcile");
    // Both desktop and mobile render a Reconcile link, so we expect at least 2
    expect(tabs.length).toBeGreaterThanOrEqual(2);
  });

  it("renders an Invest mobile tab pointing to /investments", () => {
    render(<AppShellNavView pathname="/reconcile">content</AppShellNavView>);
    const tab = screen
      .getAllByRole("link", { name: APP_SHELL_COPY.linkInvest })
      .find((el) => el.getAttribute("href") === "/investments");
    expect(tab).toBeDefined();
  });

  it("renders a More mobile tab as a button (not a link)", () => {
    render(<AppShellNavView pathname="/reconcile">content</AppShellNavView>);
    const moreBtn = screen.getByRole("button", {
      name: APP_SHELL_COPY.moreLabel,
    });
    expect(moreBtn).toBeDefined();
  });
});

describe("AppShellNavView — More overflow", () => {
  it("exposes an Annuities link inside the More overflow once opened", () => {
    render(<AppShellNavView pathname="/reconcile">content</AppShellNavView>);
    fireEvent.click(
      screen.getByRole("button", { name: APP_SHELL_COPY.moreLabel }),
    );
    // When the dialog is open, base-ui-react makes background content inert,
    // so role queries return only the dialog's content.
    const annuitiesLink = screen
      .getAllByRole("link", { name: APP_SHELL_COPY.linkAnnuities })
      .find((el) => el.getAttribute("href") === "/annuities");
    expect(annuitiesLink).toBeDefined();
  });

  it("exposes an Accounts link inside the More overflow once opened", () => {
    render(<AppShellNavView pathname="/reconcile">content</AppShellNavView>);
    fireEvent.click(
      screen.getByRole("button", { name: APP_SHELL_COPY.moreLabel }),
    );
    const accountsLink = screen
      .getAllByRole("link", { name: APP_SHELL_COPY.linkAccounts })
      .find((el) => el.getAttribute("href") === "/accounts");
    expect(accountsLink).toBeDefined();
  });

  it("exposes a Profile link inside the More overflow once opened", () => {
    render(<AppShellNavView pathname="/reconcile">content</AppShellNavView>);
    fireEvent.click(
      screen.getByRole("button", { name: APP_SHELL_COPY.moreLabel }),
    );
    const profileLink = screen
      .getAllByRole("link", { name: APP_SHELL_COPY.linkProfile })
      .find((el) => el.getAttribute("href") === "/profile");
    expect(profileLink).toBeDefined();
  });

  it("renders the overflow title when opened", () => {
    render(<AppShellNavView pathname="/reconcile">content</AppShellNavView>);
    fireEvent.click(
      screen.getByRole("button", { name: APP_SHELL_COPY.moreLabel }),
    );
    expect(
      screen.getAllByText(APP_SHELL_COPY.moreOverflowTitle).length,
    ).toBeGreaterThan(0);
  });
});

describe("AppShellNavView — children render", () => {
  it("renders the child content inside the shell", () => {
    render(
      <AppShellNavView pathname="/reconcile">
        <p data-testid="shell-child">hello shell</p>
      </AppShellNavView>,
    );
    expect(screen.getByTestId("shell-child").textContent).toBe("hello shell");
  });
});
