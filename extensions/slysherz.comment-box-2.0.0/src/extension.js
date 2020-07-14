"use strict"

// The module 'vscode' contains the VS Code extensibility API
const vscode = require('vscode')
const {
    convertToCommentBox
} = require('./comment-box')

/**
 * Define JSDoc types
 * @typedef {import('./comment-box').BoxStyle} BoxStyle
 * 
 * @typedef BoxConfiguration
 * @property {boolean} capitalize
 * @property {boolean} extendSelection
 * @property {string} commentStartToken
 * @property {string} commentEndToken
 * @property {string} topRightToken
 * @property {string} bottomLeftToken
 * @property {string} topEdgeToken
 * @property {string} bottomEdgeToken
 * @property {string} leftEdgeToken
 * @property {string} rightEdgeToken
 * @property {string} fillingToken
 * @property {number} boxWidth
 * @property {string} textAlignment
 * @property {boolean} removeEmptyLines
 * @property {boolean} ignoreOuterIndentation
 * @property {boolean} ignoreInnerIndentation
 */

function ignore() { /* Do nothing */ }

/**
 * Find the tab size for the current document
 * @returns {number}
 */
function getTabSize() {
    return vscode.workspace
        .getConfiguration("editor", vscode.window.activeTextEditor.document.uri)
        .get("tabSize")
}

/**
 * @returns {BoxConfiguration} 
 */
function loadOldConfiguration() {
    const configuration = vscode.workspace.getConfiguration("commentBox")

    return {
        capitalize: configuration.get("capitalize"),
        textAlignment: configuration.get("textAlignment"),
        boxWidth: configuration.get("boxWidth"),
        extendSelection: configuration.get("extendSelection"),
        commentStartToken: configuration.get("commentStartToken"),
        commentEndToken: configuration.get("commentEndToken"),
        topRightToken: configuration.get("topRightToken"),
        bottomLeftToken: configuration.get("bottomLeftToken"),
        topEdgeToken: configuration.get("topEdgeToken"),
        bottomEdgeToken: configuration.get("bottomEdgeToken"),
        leftEdgeToken: configuration.get("leftEdgeToken"),
        rightEdgeToken: configuration.get("rightEdgeToken"),
        fillingToken: configuration.get("fillingToken"),
        removeEmptyLines: configuration.get("removeEmptyLines"),
        ignoreOuterIndentation: configuration.get("ignoreOuterIndentation"),
        ignoreInnerIndentation: configuration.get("ignoreInnerIndentation"),
        // clearAroundText: configuration.get("textToEdgeSpace")
    }
}

/**
 * Creates a new configuration by merging a list of configurations. Each configuration might be
 * incomplete, so when no value is provided for some setting, the default value is used
 * @param {object} configurations
 * @returns {BoxConfiguration}
 * @todo Investigate if VSCode can provide these defaults for us
 */
function mergeConfigurations(configurations) {
    // Start with the default configuration
    let result = {
        capitalize: true,
        textAlignment: "center",
        boxWidth: 0,
        extendSelection: true,
        commentStartToken: "/*",
        commentEndToken: "**/",
        topRightToken: "**",
        bottomLeftToken: " **",
        topEdgeToken: "*",
        bottomEdgeToken: "*",
        leftEdgeToken: " * ",
        rightEdgeToken: " *",
        fillingToken: " ",
        removeEmptyLines: true,
        ignoreOuterIndentation: true,
        ignoreInnerIndentation: true,
    }

    for (const config of configurations) {
        result = {
            ...result,
            ...config
        }
    }

    return result
}

/**
 * @param {BoxConfiguration} configuration 
 * @param {number} tabSize 
 * @returns {BoxStyle}
 */
function configurationToStyle(configuration, tabSize) {
    return {
        startToken: configuration.commentStartToken,
        endToken: configuration.commentEndToken,
        topRightToken: configuration.topRightToken,
        bottomLeftToken: configuration.bottomLeftToken,
        topEdgeToken: configuration.topEdgeToken,
        bottomEdgeToken: configuration.bottomEdgeToken,
        leftEdgeToken: configuration.leftEdgeToken,
        rightEdgeToken: configuration.rightEdgeToken,
        width: configuration.boxWidth,
        textAlignment: configuration.textAlignment,
        removeEmptyLines: configuration.removeEmptyLines,
        ignoreOuterIndentation: configuration.ignoreOuterIndentation,
        ignoreInnerIndentation: configuration.ignoreInnerIndentation,
        fillingToken: configuration.fillingToken || " ", // Cannot be empty
        tabSize
    }
}

/**
 * Takes an open text editor and transforms the selected text into a comment box
 * @param {BoxConfiguration} configuration 
 */
function transformToCommentBox(editor, configuration) {
    const editOperations = editor.selections.map((selection) => {
        if (configuration.extendSelection) {
            // Let's extend the selection from the first character of the first line to the
            // last character of the last line
            let last = editor.document.lineAt(selection.end.line).range.end.character
            selection = new (vscode.Selection)(
                selection.start.line,
                0,
                selection.end.line,
                last)
        }

        let text = editor.document.getText(selection)

        if (configuration.capitalize) {
            text = text.toUpperCase()
        }

        text = convertToCommentBox(text, configurationToStyle(configuration, getTabSize()))

        return {
            text: text,
            selection: selection,
        }
    })

    editor.edit(builder => {
        editOperations.forEach(({
            text,
            selection
        }) => {
            // We use insert + delete instead of replace so that the selection automatically
            // jumps to the end of the comment box
            builder.delete(selection)
            builder.insert(selection.anchor, text)
        })
    })
}

/**
 * Tries to find a configuration with a given name in the user settings. If it doesn't exist, an
 * error notification is shown to the user and null is returned.
 * @param {*} baseConfig 
 * @param {string} styleName
 */
function tryGetConfiguration(baseConfig, styleName) {
    const style = baseConfig.get(`styles.${styleName}`)

    if (!style) {
        vscode.window.showErrorMessage(`Style "${styleName}" doesn't exist.`)
        return null
    }

    return style
}

// When the extension is activated
function activate(context) {
    // Register comment box command
    context.subscriptions.push(vscode.commands.registerCommand('extension.commentBox', () => {
        let editor = vscode.window.activeTextEditor

        if (!editor) {
            // No open text editor
            return;
        }

        // Load user settings
        const oldDefaultStyle = loadOldConfiguration()

        const styles = vscode.workspace.getConfiguration("commentBox")
        const newDefaultStyle = styles.get("styles.defaultStyle")

        const configuration = mergeConfigurations([oldDefaultStyle, newDefaultStyle])

        // Apply transformation
        transformToCommentBox(editor, configuration)
    }))

    context.subscriptions.push(vscode.commands.registerCommand("commentBox.transformUsingStyle",
        (...args) => {
            let editor = vscode.window.activeTextEditor

            if (!editor) {
                // No open text editor
                return;
            }

            // Load user settings
            const baseConfig = vscode.workspace.getConfiguration("commentBox")
            const styles = baseConfig.get("styles")
            const styleNames = Object.keys(styles)

            // Check whether the style to be used was passed as an argument
            if (args.length) {
                // We already have the style, use it
                const styleName = "" + args[0]

                const style = tryGetConfiguration(baseConfig, styleName)
                if (!style) {
                    return
                }

                const configuration = mergeConfigurations([style])

                transformToCommentBox(editor, configuration)
            }
            else {
                // No style was passed, ask the user
                vscode.window.showQuickPick(styleNames).then((styleName) => {
                    if (!styleName) {
                        // The used didn't pick any style
                        return
                    }

                    const style = tryGetConfiguration(baseConfig, styleName)

                    if (!style) {
                        // The user got a message something is wrong, don't do anything else
                        return
                    }

                    const configuration = mergeConfigurations([style])

                    transformToCommentBox(editor, configuration)
                }, ignore)
            }
        }))
}

// Export additional functions for testing purposes
module.exports = {
    activate,
    deactivate: ignore,
    mergeConfigurations,
    configurationToStyle,
    getTabSize
}

/** END **/