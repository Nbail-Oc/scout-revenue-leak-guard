import type { ReactNode } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { DashboardSquare01Icon, CheckListIcon, Analytics02Icon, Message01Icon, UserMultipleIcon, Plug01Icon, Settings01Icon, HelpCircleIcon, ActivityIcon } from "@hugeicons/core-free-icons";

export type SidebarNavItem = {
	title: string;
	path?: string;
	icon?: ReactNode;
	isActive?: boolean;
	subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
	label?: string;
	items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
	{
		items: [
			{
				title: "Overview",
				path: "#/overview",
				icon: (
					<HugeiconsIcon icon={DashboardSquare01Icon} strokeWidth={2} />
				),
				isActive: true,
			},
		],
	},
	{
		label: "Today",
		items: [
			{
				title: "Queue",
				path: "#/queue",
				icon: (
					<HugeiconsIcon icon={CheckListIcon} strokeWidth={2} />
				),
			},
			{
				title: "Team insights",
				path: "#/team-insights",
				icon: (
					<HugeiconsIcon icon={Analytics02Icon} strokeWidth={2} />
				),
			},
		],
	},
	{
		label: "Inbox",
		items: [
			{
				title: "Conversations",
				icon: (
					<HugeiconsIcon icon={Message01Icon} strokeWidth={2} />
				),
				subItems: [
					{ title: "Unassigned", path: "#/inbox/unassigned" },
					{ title: "Assigned to me", path: "#/inbox/assigned" },
					{ title: "Recently closed", path: "#/inbox/closed" },
				],
			},
			{
				title: "Customers",
				path: "#/customers",
				icon: (
					<HugeiconsIcon icon={UserMultipleIcon} strokeWidth={2} />
				),
			},
			{
				title: "Channels",
				path: "#/channels",
				icon: (
					<HugeiconsIcon icon={Plug01Icon} strokeWidth={2} />
				),
			},
		],
	},
	{
		label: "Organization",
		items: [
			{
				title: "Workspace",
				icon: (
					<HugeiconsIcon icon={Settings01Icon} strokeWidth={2} />
				),
				subItems: [
					{ title: "Branding", path: "#/workspace/branding" },
					{ title: "Team & roles", path: "#/workspace/team" },
					{ title: "API keys", path: "#/workspace/api-keys" },
					{ title: "Webhooks", path: "#/workspace/webhooks" },
					{ title: "Billing", path: "#/workspace/billing" },
				],
			},
		],
	},
];

export const footerNavLinks: SidebarNavItem[] = [
	{
		title: "Help Center",
		path: "#/help",
		icon: (
			<HugeiconsIcon icon={HelpCircleIcon} strokeWidth={2} />
		),
	},
	{
		title: "System status",
		path: "#/status",
		icon: (
			<HugeiconsIcon icon={ActivityIcon} strokeWidth={2} />
		),
	},
];

export const navLinks: SidebarNavItem[] = [
	...navGroups.flatMap((group) =>
		group.items.flatMap((item) =>
			item.subItems?.length ? [item, ...item.subItems] : [item]
		)
	),
	...footerNavLinks,
];
