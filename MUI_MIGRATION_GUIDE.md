# Migration Guide: Material-UI v4 to MUI v7.1.1

This guide provides instructions for migrating from Material-UI v4 to MUI v7.1.1 in your React 19.1 project.

## Key Changes

### 1. Import Path Changes

Replace all imports from `@material-ui/*` with their `@mui/*` equivalents:

#### Before:
```tsx
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
```

#### After:
```tsx
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
```

### 2. Styling Approach Changes

MUI v7 uses emotion for styling instead of JSS. The `makeStyles` and `createStyles` APIs are deprecated.

#### Before (JSS with makeStyles):
```tsx
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    title: {
      flexGrow: 1,
      color: alpha(theme.palette.common.white, 0.75)
    },
  }),
);

// In component:
const classes = useStyles();
return <div className={classes.root}>...</div>;
```

#### After (styled API):
```tsx
const Root = styled('div')(({ theme }) => ({
  display: "flex",
}));

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  color: alpha(theme.palette.common.white, 0.75)
}));

// In component:
return <Root>...</Root>;
```

### 3. Component API Changes

Some component props and behaviors have changed:

#### Grid System

The Grid component has been updated with new props:

```tsx
// Before
<Grid container spacing={3}>
  <Grid item xs={12} sm={6}>
    Content
  </Grid>
</Grid>

// After
<Grid container spacing={3}>
  <Grid xs={12} sm={6}>
    Content
  </Grid>
</Grid>
```

#### Typography

Typography variants have been updated:

```tsx
// Before
<Typography variant="body1">Text</Typography>

// After - same, but with updated styling
<Typography variant="body1">Text</Typography>
```

#### IconButton

IconButton no longer has a default padding:

```tsx
// Before
<IconButton>
  <MenuIcon />
</IconButton>

// After
<IconButton>
  <MenuIcon />
</IconButton>
```

### 4. Theme Changes

The theme structure has been updated:

```tsx
// Before
import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

// After
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});
```

## Migration Steps

1. Update your package.json (already done)
2. Update import paths in all components
3. Migrate from makeStyles/createStyles to styled API
4. Update component usage according to the new API
5. Test each component after migration

## Example Migration: TeamItem.tsx

### Before:
```tsx
import { makeStyles, createStyles, Theme, alpha } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Menu, MenuItem } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    menuButton: {
      justifyContent:'right'
    },
    title: {
      flexGrow: 1,
    },
  }),
);

// In component:
const classes = useStyles();
return <div className={classes.root}>...</div>;
```

### After:
```tsx
import { styled, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Root = styled('div')({
  display: "flex",
});

const MenuButtonContainer = styled(CardActions)({
  justifyContent: 'right'
});

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
}));

// In component:
return <Root>...</Root>;
```

## Resources

- [MUI Migration Guide](https://mui.com/material-ui/migration/migration-v4/)
- [MUI Styling Solution](https://mui.com/material-ui/guides/interoperability/)
- [MUI Component API Reference](https://mui.com/material-ui/api/button/)
