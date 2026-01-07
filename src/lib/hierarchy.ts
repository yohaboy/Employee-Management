import { db } from './db'

/**
 * Get all descendant node IDs (children, grandchildren, etc.)
 * This is used to determine which nodes a user can see and interact with
 */
export async function getDescendantIds(nodeId: string): Promise<string[]> {
    const descendants: string[] = []

    async function collectDescendants(currentNodeId: string) {
        const children = db.nodes.filter(n => n.parentId === currentNodeId)

        for (const child of children) {
            descendants.push(child.id)
            await collectDescendants(child.id)
        }
    }

    await collectDescendants(nodeId)
    return descendants
}

/**
 * Get all nodes visible to a specific node
 * Returns: self, parent, all descendants
 */
export async function getVisibleNodeIds(nodeId: string): Promise<string[]> {
    const node = db.nodes.find(n => n.id === nodeId)

    if (!node) return []

    const visibleIds = [node.id] // Self

    // Add parent if exists
    if (node.parentId) {
        visibleIds.push(node.parentId)
    }

    // Add all descendants
    const descendants = await getDescendantIds(node.id)
    visibleIds.push(...descendants)

    return visibleIds
}

/**
 * Check if nodeA can see nodeB based on hierarchy rules
 */
export async function canSeeNode(viewerNodeId: string, targetNodeId: string): Promise<boolean> {
    const visibleIds = await getVisibleNodeIds(viewerNodeId)
    return visibleIds.includes(targetNodeId)
}

/**
 * Check if a node can send a letter to another node
 * Can send to: parent or any descendant
 */
export async function canSendLetterTo(senderNodeId: string, receiverNodeId: string): Promise<boolean> {
    if (senderNodeId === receiverNodeId) return false // Cannot send to self

    const sender = db.nodes.find(n => n.id === senderNodeId)

    if (!sender) return false

    // Can send to parent
    if (sender.parentId === receiverNodeId) return true

    // Can send to any descendant
    const descendants = await getDescendantIds(senderNodeId)
    return descendants.includes(receiverNodeId)
}

/**
 * Get the hierarchical tree structure for a node
 * Returns parent and all descendants in a tree format
 */
export async function getNodeTree(nodeId: string) {
    const node = db.nodes.find(n => n.id === nodeId)

    if (!node) return null

    // Get parent if exists
    let parent = null
    if (node.parentId) {
        const parentNode = db.nodes.find(n => n.id === node.parentId)
        if (parentNode) {
            parent = {
                id: parentNode.id,
                name: parentNode.name,
                email: parentNode.email,
                position: parentNode.position,
                createdAt: parentNode.createdAt,
            }
        }
    }

    // Get all descendants recursively
    async function buildTree(currentNodeId: string): Promise<any> {
        const currentNode = db.nodes.find(n => n.id === currentNodeId)

        if (!currentNode) return null

        const children = db.nodes
            .filter(n => n.parentId === currentNodeId)
            .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

        const childrenWithDescendants = await Promise.all(
            children.map(child => buildTree(child.id))
        )

        return {
            id: currentNode.id,
            name: currentNode.name,
            email: currentNode.email,
            position: currentNode.position,
            createdAt: currentNode.createdAt,
            children: childrenWithDescendants,
        }
    }

    const treeWithDescendants = await buildTree(nodeId)

    return {
        node: treeWithDescendants,
        parent,
    }
}

/**
 * Check if a node can view a specific letter
 * Can view if: sender is self or descendant, OR receiver is self or descendant
 */
export async function canViewLetter(nodeId: string, letterId: string): Promise<boolean> {
    const letter = db.letters.find(l => l.id === letterId)

    if (!letter) return false

    const visibleNodeIds = await getVisibleNodeIds(nodeId)

    return visibleNodeIds.includes(letter.senderId) || visibleNodeIds.includes(letter.receiverId)
}
