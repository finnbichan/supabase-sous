import { DefaultTheme, DarkTheme } from "@react-navigation/native";

export const LightTheme = {
    ...DefaultTheme,
    colours: {
        ...DefaultTheme.colours,
        background: "#f2f2f2",
        card: "#DFE3E6",
        layer: "#bcc8d1",
        text: "#464F51",
        secondaryText: "#878787"
    },
    //definitely a better way to do this
    assets: {
        add_box: require("../../assets/light/add_box.png"),
        add: require("../../assets/light/add.png"),
        bolt: require("../../assets/light/bolt.png"),
        book: require("../../assets/light/book.png"),
        book_inactive: require("../../assets/light/book_inactive.png"),
        calendar: require("../../assets/light/calendar.png"),
        calendar_inactive: require("../../assets/light/calendar_inactive.png"),
        camera: require("../../assets/light/camera.png"),
        check_box: require("../../assets/light/check_box.png"),
        check_box_outline: require("../../assets/light/check_box_outline.png"),
        chef_hat: require("../../assets/light/chef_hat.png"),
        chef_hat_inactive: require("../../assets/light/chef_hat_inactive.png"),
        chevron_left: require("../../assets/light/chevron_left.png"),
        chevron_right: require("../../assets/light/chevron_right.png"),
        cross: require("../../assets/light/cross.png"),
        delete: require("../../assets/light/delete.png"),
        down: require("../../assets/light/down.png"),
        drag_handle: require("../../assets/light/drag_handle.png"),
        dropdown_arrow: require("../../assets/light/dropdown_arrow.png"),
        edit: require("../../assets/light/edit.png"),
        generate: require("../../assets/light/generate.png"),
        heart: require("../../assets/light/heart.png"),
        history: require("../../assets/light/history.png"),
        list: require("../../assets/light/list.png"),
        refresh: require("../../assets/light/refresh.png"),
        search: require("../../assets/light/search.png"),
        sous_transparent: require("../../assets/light/sous_transparent.png"),
        splash: require("../../assets/light/splash.png"),
        tick: require("../../assets/light/tick.png"),
        up: require("../../assets/light/up.png"),
        list_gen: require("../../assets/light/list_gen.png")
    }
}

export const CustomDarkTheme = {
    ...DarkTheme,
    colours: {
        ...DarkTheme.colours,
        background: "#121212",
        card: "#222222",
        layer: "#535353",
        text: "#FFFFFF",
        secondaryText: "#b3b3b3"
    },
    assets: {
        add_box: require("../../assets/dark/add_box.png"),
        add: require("../../assets/dark/add.png"),
        bolt: require("../../assets/dark/bolt.png"),
        book: require("../../assets/dark/book.png"),
        book_inactive: require("../../assets/dark/book_inactive.png"),
        calendar: require("../../assets/dark/calendar.png"),
        calendar_inactive: require("../../assets/dark/calendar_inactive.png"),
        camera: require("../../assets/dark/camera.png"),
        check_box: require("../../assets/dark/check_box.png"),
        check_box_outline: require("../../assets/dark/check_box_outline.png"),
        chef_hat: require("../../assets/dark/chef_hat.png"),
        chef_hat_inactive: require("../../assets/dark/chef_hat_inactive.png"),
        chevron_left: require("../../assets/dark/chevron_left.png"),
        chevron_right: require("../../assets/dark/chevron_right.png"),
        cross: require("../../assets/dark/cross.png"),
        delete: require("../../assets/dark/delete.png"),
        down: require("../../assets/dark/down.png"), 
        drag_handle: require("../../assets/dark/drag_handle.png"),
        dropdown_arrow: require("../../assets/dark/dropdown_arrow.png"),
        edit: require("../../assets/dark/edit.png"),
        generate: require("../../assets/dark/generate.png"),
        heart: require("../../assets/dark/heart.png"),
        history: require("../../assets/dark/history.png"),
        list: require("../../assets/dark/list.png"),
        refresh: require("../../assets/dark/refresh.png"),
        search: require("../../assets/dark/search.png"),
        sous_transparent: require("../../assets/dark/sous_transparent.png"),
        splash: require("../../assets/dark/splash.png"),
        tick: require("../../assets/dark/tick.png"),
        up: require("../../assets/dark/up.png"),
        list_gen: require("../../assets/dark/list_gen.png")
    }
}