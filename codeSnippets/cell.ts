export const navigationCell = `import { useRouter } from 'expo-router';

const router = useRouter();

<Cell.Group>
  <Cell.Navigation
    title="Navigate to Settings"
    onPress={() =>
      router.push({
        pathname: "/settings",
        params: { title: "Settings" },
      })
    }
  />

  <Cell.Navigation
    title="Notifications"
    description="Manage your notifications"
    iconName="bell"
    onPress={() =>
      router.push({
        pathname: "/notifications",
        params: {
          title: "Notifications",
          description: "Manage your notifications",
        },
      })
    }
  />
</Cell.Group>`;

export const swipeableCell = `<Cell.Group>
  <Cell
    rightSwipeGroup={[
      {
        title: "Delete",
        iconName: "delete",
        color: "danger",
      },
    ]}
  >
    <Typography>Swipe left to delete</Typography>
  </Cell>

  <Cell
    leftSwipeGroup={[
      {
        title: "Archive",
        iconName: "archive",
      },
      {
        title: "Star",
        iconName: "star",
        color: "warning",
      },
    ]}
  >
    <Typography>Swipe right for actions</Typography>
  </Cell>

  <Cell
    leftSwipeGroup={[
      {
        iconName: "check",
        color: "success",
      },
    ]}
    rightSwipeGroup={[
      {
        iconName: "close",
        color: "danger",
      },
    ]}
  >
    <Typography>Swipe either direction</Typography>
  </Cell>
</Cell.Group>`;
